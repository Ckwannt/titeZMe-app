/**
 * location-utils.ts
 * Shared helpers for normalising and comparing city / country strings
 * across the barbers page, shops page, onboarding, and settings.
 */

/**
 * Normalise a location string to Title Case, trimmed.
 * "madrid" → "Madrid"
 * "CASABLANCA" → "Casablanca"
 * "  new york  " → "New York"
 */
export function normalizeLocation(value: string): string {
  if (!value || typeof value !== 'string') return '';
  return value
    .trim()
    .toLowerCase()
    .split(' ')
    .map(word => (word ? word.charAt(0).toUpperCase() + word.slice(1) : ''))
    .join(' ');
}

/**
 * Flexible bi-directional city / country match.
 * Handles:
 *   - Case differences  → "madrid" matches "Madrid"
 *   - Partial matches   → "Madrid" matches "Madrid, Comunidad de Madrid"
 *   - Geolocation drift → Nominatim "Casablanca" vs library "Casablanca"
 */
export function locationsMatch(stored: string, selected: string): boolean {
  if (!stored || !selected) return false;
  const a = stored.toLowerCase().trim();
  const b = selected.toLowerCase().trim();
  return a === b || a.includes(b) || b.includes(a);
}
