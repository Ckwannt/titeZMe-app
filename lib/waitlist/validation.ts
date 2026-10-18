import { Country } from 'country-state-city';
import { z } from 'zod';
import type { WaitlistErrors, WaitlistValidation } from './contract';
import { CONSENT_VERSION, PRIVACY_VERSION } from './contract';

const shape = z.object({ country: z.string(), city: z.string(), email: z.string(), placeId: z.string().nullable(), placeRegion: z.string(), missingPlace: z.boolean(), consent: z.boolean(), consentVersion: z.string(), privacyVersion: z.string() }).strict();
const emailSyntax = z.string().email();
const controlCharacters = /[\p{Cc}\p{Cs}]/u;

/** Pure validation shared with the server parser. Recognized countries are not a launch-availability policy. */
export function validateWaitlist(input: unknown): WaitlistValidation {
  const parsed = shape.safeParse(input);
  if (!parsed.success) return { valid: false, error: { code: 'invalid_request' } };
  const raw = parsed.data;
  const country = raw.country.trim().toUpperCase();
  const city = raw.city.trim().normalize('NFC');
  const email = raw.email.trim();
  const fields: WaitlistErrors = {};

  if (!country) fields.country = 'required';
  else if (!/^[A-Z]{2}$/.test(country) || !Country.getCountryByCode(country)) fields.country = 'invalid';
  if (!city) fields.city = 'required';
  else if (controlCharacters.test(raw.city)) fields.city = 'invalid';
  else if ([...city].length > 120) fields.city = 'too_long';
  else if (raw.placeRegion.length > 120 || controlCharacters.test(raw.placeRegion)) fields.city = 'invalid';
  else if (raw.missingPlace ? raw.placeId !== null || !raw.placeRegion.trim() : !/^geonames:[0-9]+$/.test(raw.placeId || '')) fields.city = 'place_required';
  if (!raw.consent) fields.consent = 'required';
  else if (raw.consentVersion !== CONSENT_VERSION || raw.privacyVersion !== PRIVACY_VERSION) fields.consent = 'version_changed';

  let normalizedEmail = email;
  if (!email) fields.email = 'required';
  else if (controlCharacters.test(raw.email)) fields.email = 'invalid';
  else if (email.length > 254) fields.email = 'too_long';
  else {
    const separator = email.lastIndexOf('@');
    const local = email.slice(0, separator);
    const domain = email.slice(separator + 1);
    if (separator < 1 || email.indexOf('@') !== separator || !domain || /\s/u.test(email)) fields.email = 'invalid';
    else if (/[^\x00-\x7f]/u.test(email) || domain.toLowerCase().split('.').some(label => label.startsWith('xn--'))) {
      // No silent SMTPUTF8/IDN support decision. Preserve candidates locally for review only.
      fields.email = 'email_policy_unresolved';
    } else {
      normalizedEmail = `${local}@${domain.toLowerCase()}`;
      if (local.length > 64 || !emailSyntax.safeParse(normalizedEmail).success || domain.split('.').some(label => label.length > 63 || label.endsWith('-'))) fields.email = 'invalid';
    }
  }

  if (Object.keys(fields).length) return { valid: false, error: { code: 'validation_failed', fields } };
  return { valid: true, value: { ...raw, country, city, placeRegion: raw.placeRegion.trim().normalize('NFC'), email: normalizedEmail } };
}
