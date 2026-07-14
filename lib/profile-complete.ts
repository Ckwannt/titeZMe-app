// Centralized profile-completeness check used by RouteGuard to enforce
// that every user (regardless of signup path) has the minimum required
// fields before being allowed into the app.

const PROFESSIONAL_DEFAULTS = ['Unknown', 'unknown'];

export function isProfileComplete(user: Record<string, any>): boolean {
  if (!user) return false;

  const hasBasicFields =
    !!user.firstName?.trim() &&
    !!user.lastName?.trim() &&
    !!user.phone?.trim() &&
    !!user.city?.trim() &&
    !!user.country?.trim();

  if (!hasBasicFields) return false;

  // Professionals: isOnboarded flag on the users doc is the sole routing gate.
  // phone/city/country live authoritatively on professionalProfiles, not users,
  // so we do not check them here for professionals.
  if (user.role === 'professional') {
    return user.isOnboarded === true;
  }

  return true;
}

export function getMissingFields(user: Record<string, any>): string[] {
  const missing: string[] = [];
  if (!user?.firstName?.trim()) missing.push('firstName');
  if (!user?.lastName?.trim()) missing.push('lastName');
  if (!user?.phone?.trim()) missing.push('phone');
  if (!user?.city?.trim()) missing.push('city');
  if (!user?.country?.trim()) missing.push('country');
  if (user?.role === 'professional' && PROFESSIONAL_DEFAULTS.includes(user?.city)) {
    if (!missing.includes('city')) missing.push('city');
  }
  return missing;
}
