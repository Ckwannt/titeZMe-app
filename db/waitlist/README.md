# Dedicated waitlist database — local implementation

Nothing in this directory provisions a database, opens enrollment, sends email, or changes Firebase. The migration is for a **new dedicated database**, never the marketplace database.

## Installation after separate provisioning approval

1. Create an isolated Neon project/branch in an explicitly approved EU region. Record region, processor agreement, access owners, restore policy and cost approval. First use synthetic data only.
2. Apply `001_foundation.sql` once using the migration identity. Confirm PostgreSQL supports `pgcrypto` and role creation. Migration creates only NOLOGIN roles and disabled policy, not a runtime account.
3. Create a separate `waitlist_ingest` LOGIN identity through a secure administrative session; grant only membership in `waitlist_api`, with inheritance. Never grant membership in `waitlist_owner`, migration, privacy or delivery roles. Revoke unrelated database/schema creation permissions. Do not put passwords in shell history or this repository.
4. Verify the runtime identity can execute the two public procedures but cannot SELECT, INSERT, UPDATE, DELETE, export tables, read keys, change policy, create schema objects, grant roles, or run maintenance. Restrict any future maintenance identity to `waitlist_privacy` membership. `waitlist_delivery` intentionally has no access; sending notifications is not activated here.
5. Preview-only server configuration names: `WAITLIST_DATABASE_URL` and `WAITLIST_ORIGIN`. The connection URL must name `waitlist_ingest` on a Neon host. Never expose it as NEXT_PUBLIC, reuse Firebase Admin credentials, or copy production environment values into an unreviewed preview. Application code gates still prevent use of these settings.

## Processing guarantees and limits

- Registration is one transactional SQL statement. Advisory transaction locks serialize an idempotency key and an email lookup; unique indexes independently enforce one delivery address/lookup. Suppression is checked while the email lock is held. Removal uses the same email lock. Anonymous duplicates cannot update existing city, consent evidence, expiry or withdrawn state.
- New, duplicate and suppressed attempts receive the same JSON shape and a 256-bit receipt. Only a receipt created with a new subscription controls that subscription. Other receipts are inert. No status-dependent error message or email is sent. Timing equality is not a claim.
- Receipt hashes control subscriptions. Idempotency results retain encrypted receipts for 24 hours for identical retries; payload fingerprints and email/network rate keys are HMACs using restricted database keys. These remain pseudonymous data, not anonymous records.
- Active expiry defaults to the proposed 12 months. Suppression duration is NULL and registration remains disabled until approved. Test fixtures use 30 days **only as synthetic test configuration**, not a business/privacy policy.
- API validates recognized country, canonical GeoNames place or self-declared missing-place region, email, exact fields and versions before SQL. SQL adds independent type/range checks. Email normalization lowercases the domain and preserves local-part case and plus tags. Internationalized addresses remain explicitly unresolved.
- Database global/network/email budgets are atomic. Identical retries still consume global/network request budgets; they cannot bypass abuse protection by replaying a cached receipt. Removal procedures also have a global abuse budget. Network keys rely on Vercel's platform-provided forwarded header and require a deployment spoofing test before activation. Configure and verify edge protection for all waitlist and geographic-search endpoints; no WAF policy has been provisioned.
- Errors never echo provider messages or input. Request bodies, capabilities and Neon calls are excluded from application telemetry. Independently verify platform, database, proxy, backup and support logging policies; application filters cannot control a provider's administrative logging.

## Before activation

The isolated multi-connection Neon concurrency/permission suite, HTTPS adapter integration, unknown-commit retry tests, key rotation/restore exercise, edge abuse testing, geographic function bundle/memory checks and privacy review are required. PGlite tests exercise real embedded PostgreSQL procedures but serialize one connection; queued promises do not prove multi-connection behavior.

Approve consent/legal notice and its final version, active retention, suppression purpose/duration, encrypted retry retention, deletion/backup deadlines, processor region/contracts, rights requests and lost-receipt identity verification. Schedule and verify `waitlist.purge_expired()` using a restricted maintenance identity. No scheduler is activated locally.

Only after those gates and separate collection authorization may a reviewed change open the application gates and set database policy. Do not infer activation approval from permission to create a preview.

## Withdrawal, deletion, maintenance and rollback

Receipts stay in tab memory and may be saved privately by the visitor; they never enter a URL, browser storage or analytics. Both removal actions erase identifying subscription fields and retain only the approved pseudonymous suppression marker. Repeated or unknown receipts get the same generic response. Manual lost-receipt privacy requests require a separately approved verification process; anonymous email submission cannot grant control over an existing subscription.

Use database `policy.enabled=false` to stop new registrations while keeping privacy procedures available in an already approved deployment. Avoid reverting schemas destructively. Restore tests must verify that suppression/deletions survive and must not resurrect deleted subscriptions. Key rotation needs a separately reviewed versioned-key migration that preserves lookup and suppression matching; replacing keys in place is unsafe.
