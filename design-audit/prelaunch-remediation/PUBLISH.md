# Protected preview publication — 20 October 2026

The founder authorized committing, pushing and deploying the reviewed local work. This publication is a protected preview, not a production cutover or authorization to collect personal data.

## Scope

Publish the existing homepage remediation, approved introduction, normalized worldwide place catalogue, disabled waitlist integration, restricted SQL migration and reviewed local security fixes. Preserve unrelated local audit artifacts and existing working files.

Vercel project: `tite-z-me-app` (`prj_hW9W7LfJfCTuLZrjMrmhvDEtWqJM`). Git production branch was verified as `main`. Deploy only `codex/prelaunch-remediation-preview`. Preserve Vercel Authentication, production domains and production environment settings.

## Preview isolation

Existing Vercel environment metadata shows the production Firebase Admin credential is shared with Preview. No secret values were read or changed. Preview code therefore prevents Firebase Admin initialization and rejects legacy application routes and privileged APIs with a no-store 404. Only the homepage, its assets, geographic lookup and disabled waitlist endpoints are available. These restrictions depend on Vercel's trusted `VERCEL_ENV=preview`, not user request headers. Production route behavior is preserved.

Enrollment remains blocked by four false code gates in `lib/waitlist/release.ts`. Registration, withdrawal and deletion endpoints return unavailable responses without persistence or email. No Neon service was provisioned. No production Firebase rules, claims, records or configuration were changed by publishing this code. Local rules changes are review artifacts and must not be separately deployed before the compatibility and claims migration gates are satisfied.

## Verification and limits

Fresh checks cover TypeScript, the production build in preview mode, 44 preview-containment assertions, 23 security assertions, 84 isolated synthetic waitlist assertions, and built-page Edge/WebKit smoke tests. Detailed local evidence and screenshots remain in this directory but are excluded from the deployment by `.vercelignore`.

The broader 18 October remediation reports are historical local evidence; their statements that no commit or push had occurred describe that earlier task. This publication does not close their open release gates.

## Production blockers

- Firebase custom-claim migration, emulator coverage and compatibility verification before deploying local rules or administrative behavior.
- Remaining legacy authorization, booking, membership, moderation, deletion and telemetry findings.
- Privacy/legal approval of notice, retention, suppression, deletion, processors and recovery policies.
- Separately approved EU Neon provisioning, least-privilege credentials, independent-connection concurrency, recovery and distributed abuse controls.
- Manual contrast/assistive-technology review and final production review.

## Cutover and rollback

Do not promote this preview merely because it builds. Close the gates above, verify an isolated production-equivalent release, obtain the final approved cutover scope, and then promote the exact verified deployment. Keep enrollment disabled unless separately approved and verified. Do not change DNS for a normal Vercel promotion. Record the previous production deployment before any cutover; Vercel rollback restores the previous deployment, while database or Firebase policy changes require their own reviewed recovery plan and cannot be undone by a website rollback.
