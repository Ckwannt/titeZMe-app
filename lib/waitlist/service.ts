import { z } from 'zod';
import { parseWaitlistRequest } from './server';
import { resolvePlace } from './places';
import type { WaitlistResponse } from './contract';

export interface SqlClient { query<T>(sql: string, parameters: unknown[]): Promise<{ rows: T[] }> }
export interface WaitlistServiceOptions {
  enabled: boolean;
  origin: string;
  sql: SqlClient;
  networkAddress: (request: Request) => string;
  placeResolver?: typeof resolvePlace;
}
const responseSchema = z.union([
  z.object({ status: z.literal('processed'), withdrawalReceipt: z.string().regex(/^[a-f0-9]{64}$/) }).strict(),
  z.object({ status: z.literal('processed') }).strict(),
  z.object({ code: z.enum(['enrollment_disabled', 'invalid_request', 'rate_limited', 'idempotency_conflict']) }).strict(),
]);
function reply(body: unknown, status: number) {
  return Response.json(body, { status, headers: { 'Cache-Control': 'no-store, max-age=0', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store', ...(status === 429 ? { 'Retry-After': '900' } : {}) } });
}
export function createWaitlistService(options: WaitlistServiceOptions) {
  return async (request: Request, action: 'register' | 'withdrawal' | 'deletion' = 'register'): Promise<Response> => {
    if (!options.enabled) return reply({ code: 'enrollment_disabled' }, 503);
    if (request.method !== 'POST') return reply({ code: 'invalid_request' }, 405);
    if (request.headers.get('origin') !== options.origin || request.headers.get('sec-fetch-site') === 'cross-site') return reply({ code: 'forbidden_origin' }, 403);
    try {
      let result: unknown;
      if (action === 'register') {
        const parsed = await parseWaitlistRequest(request);
        if (!parsed.valid) return reply(parsed.error, parsed.error.code === 'request_too_large' ? 413 : parsed.error.code === 'unsupported_media_type' ? 415 : parsed.error.code === 'validation_failed' ? 422 : 400);
        const value = parsed.value;
        if (!value.missingPlace) {
          const place = await (options.placeResolver || resolvePlace)(value.country, value.placeId!);
          if (!place || place.name.trim().normalize('NFC') !== value.city || place.region.trim().normalize('NFC') !== value.placeRegion) return reply({ code: 'validation_failed', fields: { city: 'place_required' } }, 422);
        }
        const key = request.headers.get('idempotency-key') || '';
        if (!/^[A-Za-z0-9_-]{32,80}$/.test(key)) return reply({ code: 'invalid_request' }, 400);
        const rows = await options.sql.query<{ result: unknown }>('SELECT waitlist.register($1::jsonb,$2::text,$3::text) AS result', [JSON.stringify(value), key, options.networkAddress(request)]);
        result = rows.rows[0]?.result;
      } else {
        if (!request.headers.get('content-type')?.startsWith('application/json') || Number(request.headers.get('content-length') || 0) > 256) return reply({ code: 'invalid_request' }, 400);
        const reader = request.body?.getReader();
        if (!reader) return reply({ code: 'invalid_request' }, 400);
        let text = ''; let bytes = 0;
        const decoder = new TextDecoder('utf-8', { fatal: true });
        let timer: ReturnType<typeof setTimeout> | undefined;
        const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => { void reader.cancel().catch(() => undefined); reject(new Error('Body timeout')); }, 3000); });
        try {
          while (true) {
            const part = await Promise.race([reader.read(), timeout]); if (part.done) break;
            bytes += part.value.byteLength;
            if (bytes > 256) { void reader.cancel(); return reply({ code: 'request_too_large' }, 413); }
            text += decoder.decode(part.value, { stream: true });
          }
          text += decoder.decode();
        } finally { clearTimeout(timer); reader.releaseLock(); }
        const input = z.object({ receipt: z.string().regex(/^[a-f0-9]{64}$/) }).strict().safeParse(JSON.parse(text));
        if (!input.success) return reply({ status: 'processed' }, 200);
        const rows = await options.sql.query<{ result: unknown }>('SELECT waitlist.remove_subscription($1::text,$2::text) AS result', [input.data.receipt, action]);
        result = rows.rows[0]?.result;
      }
      const parsedResponse = responseSchema.safeParse(result);
      if (!parsedResponse.success) return reply({ code: 'enrollment_disabled' }, 503);
      const value = parsedResponse.data;
      if ('status' in value) return reply(value, 200);
      if (value.code === 'rate_limited') return reply({ code: value.code, retryAfterSeconds: 900 }, 429);
      return reply(value, value.code === 'enrollment_disabled' ? 503 : value.code === 'idempotency_conflict' ? 409 : 400);
    } catch {
      // SQL/provider errors can contain parameters and credentials. Never expose or log them.
      return reply({ code: 'enrollment_disabled' }, 503);
    }
  };
}

export function isProcessed(value: WaitlistResponse): value is Extract<WaitlistResponse, { status: 'processed' }> {
  return 'status' in value && value.status === 'processed';
}
