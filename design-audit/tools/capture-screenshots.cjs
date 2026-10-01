const fs=require('fs');
const {chromium}=require('C:/Users/CKwant/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
const browser=await chromium.launch({channel:'chrome',headless:true});
const records=[],issues=[];
for(const [kind,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
 const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,locale:'en-GB',timezoneId:'Europe/Madrid'});
 const page=await context.newPage(); let errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 async function capture(slug,route,notes='',full=true){const file=slug+'__'+kind+'__'+width+'x'+height+'.png';await page.screenshot({path:'design-audit/screenshots/'+file,animations:'allow'});let fullFile=null;const size=await page.evaluate(()=>({width:innerWidth,height:innerHeight,scrollHeight:document.documentElement.scrollHeight,scrollWidth:document.documentElement.scrollWidth,font:getComputedStyle(document.body).fontFamily}));if(full&&size.scrollHeight>height){fullFile=slug+'__'+kind+'__'+width+'x'+height+'__full-page.png';await page.screenshot({path:'design-audit/screenshots/'+fullFile,fullPage:true,animations:'allow'});}records.push({file,fullFile,route,actualUrl:page.url(),notes,capturedAt:new Date().toISOString(),viewport:size,body:(await page.locator('body').innerText()).slice(0,16000),errors:[...errors]});console.log(file+' '+page.url());errors=[];fs.writeFileSync('design-audit/evidence/screenshots.json',JSON.stringify({records,issues},null,2));}
 async function open(route){await page.goto('http://localhost:3000'+route,{waitUntil:'domcontentloaded',timeout:120000});await page.waitForTimeout(3500);}
 for(const [slug,route] of [['client-home','/'],['search-barbers','/barbers'],['search-shops','/shops'],['login','/login'],['signup','/signup'],['forgot-password','/forgot-password'],['contact','/contact'],['for-shops','/for-shops'],['admin-login','/admin/login'],['not-found','/audit-route-not-found']]){
  try{await open(route);await capture(slug,route,slug==='client-home'?'Fresh anonymous context, cookie banner visible.':'Anonymous session; cookie consent rejected via existing UI after home.');
   if(slug==='client-home'){const reject=page.getByRole('button',{name:'Reject all',exact:true});if(await reject.count())await reject.click();}
   if(slug==='search-barbers'){const links=await page.locator('a[href^="/barber/"]').evaluateAll(a=>a.map(x=>({href:x.getAttribute('href'),text:x.textContent})));fs.writeFileSync('design-audit/evidence/provider-links-'+kind+'.json',JSON.stringify(links,null,2));}
   if(slug==='login'){
    const email=page.locator('input[type="email"]').first();if(await email.count()){await email.focus();await capture('login-email-focus',route,'Focused email field using keyboard focus.');}
    const btn=page.getByRole('button',{name:/Sign in|Log in/}).first();if(await btn.count()){await btn.hover();await capture('login-button-hover',route,'Existing sign-in button hovered; no submission.');}
    const pass=page.locator('input[type="password"]').first();if(await pass.count()){await pass.fill('audit-placeholder');const toggle=page.getByRole('button',{name:/Show password/});if(await toggle.count()){await toggle.first().click();await capture('login-password-visible',route,'Existing password visibility toggle, dummy local text; not submitted.');await pass.fill('');}}
   }
   if(slug==='signup'){const email=page.locator('input[type="email"]').first();if(await email.count()){await email.fill('invalid-address');await email.blur();await capture('signup-validation',route,'Invalid local email then blur; no account created or form submitted.');}}
  }catch(e){issues.push({kind,route,error:e.message});console.log('ERROR '+route+' '+e.message);}
 }
 // Existing public missing-provider state: no invented profile or data.
 try{await open('/shop/audit-nonexistent-id');await page.waitForTimeout(5000);await capture('shop-profile-missing','/shop/audit-nonexistent-id','Deliberately nonexistent identifier to observe implemented missing-profile branch.');}catch(e){issues.push({kind,route:'/shop/audit-nonexistent-id',error:e.message});}
 try{await open('/dashboard/client/titiza');await capture('titiza-access-gate','/dashboard/client/titiza','Anonymous access result; NOT a screenshot of the protected Titiza interface.');}catch(e){issues.push({kind,route:'/dashboard/client/titiza',error:e.message});}
 // Film runs on its own implementation clock. No timeline/layout manipulation.
 try{
  await page.goto('http://localhost:3000/preview/titiza-film',{waitUntil:'domcontentloaded',timeout:120000});
  await page.waitForTimeout(9000);await capture('titiza-film-birth','/preview/titiza-film','Public scripted preview; naturally elapsed approximately 9s after DOMContentLoaded.',false);
  await page.waitForTimeout(11000);await capture('titiza-film-conversation','/preview/titiza-film','Public scripted conversation, approximately 20s; NOT live AI chat.',false);
  await page.waitForTimeout(16000);await capture('titiza-film-recommendation','/preview/titiza-film','Public scripted professional recommendation, approximately 36s; NOT live search results.',false);
 }catch(e){issues.push({kind,route:'/preview/titiza-film',error:e.message});}
 await context.close();
}
fs.writeFileSync('design-audit/evidence/screenshots.json',JSON.stringify({records,issues},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
