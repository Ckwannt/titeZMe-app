const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium, webkit, request } = require(process.env.PLAYWRIGHT_RUNTIME || 'playwright');
const origin = 'http://localhost:3106';
let checks = 0;
const results = { layouts: [], routes: [], api: [], syntheticOnly: true };
function check(value, message) { assert.ok(value, message); checks++; }
(async () => {
  fs.mkdirSync(path.join(__dirname, 'preview-screenshots'), { recursive: true });
  for (const [name, engine, options] of [['edge', chromium, { channel: 'msedge' }], ['webkit', webkit, {}]]) {
    const browser = await engine.launch({ headless: true, ...options });
    try {
      const context = await browser.newContext();
      await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const page = await context.newPage(), errors = [];
      page.on('pageerror', error => errors.push(error.message));
      for (const [width, height] of name === 'edge' ? [[1440, 900], [390, 844], [320, 700]] : [[390, 844]]) {
        await page.setViewportSize({ width, height });
        check((await page.goto(origin, { waitUntil: 'networkidle' })).status() === 200, 'homepage available');
        check(await page.locator('#email').isDisabled() && await page.locator('button[type=submit]').isDisabled(), 'enrollment disabled');
        check(!await page.locator('#consent').isChecked(), 'consent unchecked');
        const geometry = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(i => i.getBoundingClientRect().width > 0 && !i.naturalWidth).length }));
        check(!geometry.overflow && !geometry.broken, 'responsive images and width');
        await page.screenshot({ path: path.join(__dirname, 'preview-screenshots', `${name}-${width}.png`), fullPage: true });
        results.layouts.push({ name, width, height, ...geometry });
      }
      await page.getByRole('button', { name: 'Privacy notice (draft)' }).click();
      check(await page.locator('#privacy-heading').evaluate(e => e === document.activeElement), 'privacy heading focus');
      await page.keyboard.press('Escape');
      await page.waitForFunction(() => document.activeElement?.textContent === 'Privacy notice (draft)');
      check(!errors.length, 'no browser errors');
      const scripts = await page.locator('script[src]').evaluateAll(es => es.map(e => e.src));
      const sources = await Promise.all(scripts.map(async url => (await context.request.get(url)).text()));
      check(!sources.some(s => s.includes('firestore.googleapis.com') || s.includes('auth/invalid-api-key')), 'homepage provider isolation');
    } finally { await browser.close(); }
  }
  const api = await request.newContext();
  try {
    for (const route of ['/login', '/barbers', '/book/local-preview', '/dashboard/client', '/dashboard/barber', '/admin/login', '/api/delete-account', '/api/admin/upload-reference-photo']) {
      const response = await api.get(origin + route);
      check(response.status() === 404 && response.headers()['cache-control'] === 'no-store', 'preview route containment ' + route);
      results.routes.push({ route, status: response.status() });
    }
    for (const route of ['/api/waitlist', '/api/waitlist/withdraw', '/api/waitlist/delete']) {
      const response = await api.post(origin + route, { data: {} });
      check(response.status() === 503 && response.headers()['cache-control'].includes('no-store'), 'disabled API ' + route);
      results.api.push({ route, status: response.status() });
    }
  } finally { await api.dispose(); }
  fs.writeFileSync(path.join(__dirname, 'preview-smoke-results.json'), JSON.stringify({ checks, ...results }, null, 2));
  console.log(`${checks} preview smoke checks passed`);
})().catch(error => { console.error(error); process.exitCode = 1; });
