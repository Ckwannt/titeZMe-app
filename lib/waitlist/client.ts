import type { WaitlistTransport, WaitlistErrors } from './contract';
import { enrollmentAllowed } from './release';
import { z } from 'zod';

let attempt: { fingerprint: string; key: string } | undefined;
const resultSchema = z.object({ status: z.literal('processed'), withdrawalReceipt: z.string().regex(/^[a-f0-9]{64}$/) }).strict();
const fieldCode = z.enum(['required', 'invalid', 'too_long', 'email_policy_unresolved', 'place_required', 'version_changed']);
const failureSchema = z.object({ code: z.literal('validation_failed'), fields: z.object({ country: fieldCode.optional(), city: fieldCode.optional(), placeRegion: fieldCode.optional(), email: fieldCode.optional(), consent: fieldCode.optional() }).strict() }).strict();
/** Input and retry key live only in this tab's memory. Public collection stays gated. */
export const submitWaitlist: WaitlistTransport = async request => {
  if (!enrollmentAllowed()) return { code: 'enrollment_disabled' };
  const fingerprint = JSON.stringify(request);
  if (!attempt || attempt.fingerprint !== fingerprint) attempt = { fingerprint, key: crypto.randomUUID().replaceAll('-', '') };
  try {
    const response = await fetch('/api/waitlist', { method: 'POST', credentials: 'same-origin', redirect: 'error', cache: 'no-store', signal: AbortSignal.timeout(10000), headers: { 'Content-Type': 'application/json', 'Idempotency-Key': attempt.key }, body: fingerprint });
    if (response.status === 429) return { code: 'rate_limited', retryAfterSeconds: Number(response.headers.get('retry-after')) || 900 };
    if (response.status === 409) return { code: 'idempotency_conflict' };
    if (response.status === 422) {
      const failure = failureSchema.safeParse(await response.json());
      if (failure.success) return { code: 'validation_failed', fields: failure.data.fields as WaitlistErrors };
    }
    if (!response.ok) return { code: 'processing_unconfirmed' };
    const result = resultSchema.safeParse(await response.json());
    return result.success ? result.data : { code: 'processing_unconfirmed' };
  } catch { return { code: 'processing_unconfirmed' }; }
};
