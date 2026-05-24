// Centralized profile-completeness check used by RouteGuard to enforce
// that every user (regardless of signup path) has the minimum required
// fields before being allowed into the app.

const BARBER_DEFAULTS = ['Unknown', 'unknown'];

export function isProfileComplete(user: Record<string, any>): boolean {
  if (!user) return false;

  const hasBasicFields =
    !!user.firstName?.trim() &&
    !!user.lastName?.trim() &&
    !!user.phone?.trim() &&
    !!user.city?.trim() &&
    !!user.country?.trim();

  if (!hasBasicFields) return false;

  // Barbers who skipped onboarding get city="Unknown" by default.
  // Treat that as incomplete so they're re-routed to onboarding.
  if (user.role === 'barber') {
    if (BARBER_DEFAULTS.includes(user.city)) return false;
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
  if (user?.role === 'barber' && BARBER_DEFAULTS.includes(user?.city)) {
    if (!missing.includes('city')) missing.push('city');
  }
  return missing;
}
