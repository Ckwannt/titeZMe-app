import { MAX_WAITLIST_BODY_BYTES } from './contract';
import type { WaitlistValidation } from './contract';
import { validateWaitlist } from './validation';

/** Server-side parsing foundation, deliberately not reached by the disabled public handler. */
export async function parseWaitlistRequest(request: Request): Promise<WaitlistValidation> {
  const fail = (code: 'invalid_request' | 'request_too_large' | 'unsupported_media_type'): WaitlistValidation => ({ valid: false, error: { code } });
  if (!/^application\/json(?:\s*;\s*charset=utf-8)?\s*$/i.test(request.headers.get('content-type') || '')) return fail('unsupported_media_type');
  if (request.headers.has('content-encoding') && request.headers.get('content-encoding')?.toLowerCase() !== 'identity') return fail('unsupported_media_type');
  const length = request.headers.get('content-length');
  if (length !== null && !/^\d+$/.test(length)) return fail('invalid_request');
  if (length !== null && Number(length) > MAX_WAITLIST_BODY_BYTES) return fail('request_too_large');
  if (!request.body) return fail('invalid_request');

  const reader = request.body.getReader();
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => { timer = setTimeout(() => { void reader.cancel().catch(() => undefined);reject(new Error('Body timeout')); }, 3000); });
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await Promise.race([reader.read(), timeout]);
      if (done) break;
      size += value.byteLength;
      if (size > MAX_WAITLIST_BODY_BYTES) {
        void reader.cancel().catch(() => undefined);
        return fail('request_too_large');
      }
      chunks.push(value);
    }
    const bytes = new Uint8Array(size);
    let offset = 0;
    for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
    const input: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    return validateWaitlist(input);
  } catch {
    // Never include parser errors, payload fragments or field values in responses or logs.
    return fail('invalid_request');
  } finally {
    clearTimeout(timer);
    reader.releaseLock();
  }
}
