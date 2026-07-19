// Titiza Phase 2 feature flag.
//
// The entire Phase 2 selection flow (everything past "Let's Begin") is gated
// here. Frozen Decision #5: defaults OFF for real users. When off, behavior is
// UNCHANGED from Phase 1 — the existing BeautyProfileCard / FeatureCards
// dashboard renders after "Let's Begin" exactly as before.
//
// No feature-flag convention existed in this codebase (env vars follow the
// NEXT_PUBLIC_* prefix; admin access is Firestore-based, not a UID allowlist),
// so per Frozen Decision #5 this pairs a NEXT_PUBLIC env flag with a hardcoded
// test-UID allowlist. The allowlist lets specific test accounts reach Phase 2
// for verification without flipping the env flag for everyone.

/**
 * Test-account UIDs allowed into Phase 2 regardless of the env flag. Add the
 * Firebase Auth UID of any account that should preview Phase 2 here. Empty by
 * default, so with the env flag unset the flow is fully OFF for all users.
 */
const PHASE2_TEST_UIDS: readonly string[] = [
  // 'paste-a-test-account-uid-here',
];

/** True when the env flag is explicitly turned on for everyone. */
function envFlagOn(): boolean {
  return process.env.NEXT_PUBLIC_TITIZA_PHASE2_ENABLED === 'true';
}

/**
 * Whether the Phase 2 selection flow is enabled for this user.
 *
 * @param uid Firebase Auth UID of the current user (optional / may be undefined
 *            before auth resolves — treated as not-allowlisted).
 */
// TEMPORARY: Phase 2 is enabled globally during solo testing. Re-gate this
// before real signups exist — set back to false so the env flag + test-UID
// allowlist below take over again. Typed as `boolean` (not the literal `true`)
// so the original gating code stays reachable/live, just short-circuited.
const TEMP_ENABLE_GLOBALLY: boolean = true;

export function isTitizaPhase2Enabled(uid?: string | null): boolean {
  if (TEMP_ENABLE_GLOBALLY) return true;

  if (envFlagOn()) return true;
  if (uid && PHASE2_TEST_UIDS.includes(uid)) return true;
  return false;
}
