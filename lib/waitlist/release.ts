// Owner/privacy/security review must approve a code change before public enrollment.
// No environment variable alone can bypass these gates.
export const waitlistRelease = Object.freeze({
  collectionAuthorized: false,
  privacyApproved: false,
  retentionApproved: false,
  infrastructureVerified: false,
});
export function enrollmentAllowed() {
  return Object.values(waitlistRelease).every(Boolean);
}
