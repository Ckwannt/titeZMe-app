/** Authority comes only from Firebase-verified custom claims, never profile fields. */
export function hasAdminAuthority(claims: Record<string, unknown> | null | undefined): boolean {
  return claims?.admin === true;
}
export function hasSuperAdminAuthority(claims: Record<string, unknown> | null | undefined): boolean {
  return hasAdminAuthority(claims) && claims?.superAdmin === true;
}
