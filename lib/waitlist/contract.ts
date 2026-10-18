/** Notification of city availability only. No enrollment-success response exists. */
export const WAITLIST_ENDPOINT = '/api/waitlist';
export const MAX_WAITLIST_BODY_BYTES = 2048;
export const CONSENT_VERSION = 'city-notification-v1';
export const PRIVACY_VERSION = 'draft-2026-10-18';
export const waitlistFields = ['country', 'city', 'email', 'consent'] as const;
export type WaitlistField = typeof waitlistFields[number];

export interface WaitlistRequest {
  country: string;
  city: string;
  email: string;
  placeId: string | null;
  placeRegion: string;
  missingPlace: boolean;
  consent: boolean;
  consentVersion: string;
  privacyVersion: string;
}

export type WaitlistFieldError = 'required' | 'invalid' | 'too_long' | 'email_policy_unresolved' | 'place_required' | 'version_changed';
export type WaitlistErrors = Partial<Record<WaitlistField, WaitlistFieldError>>;
export type WaitlistFailure =
  | { code: 'invalid_request' | 'request_too_large' | 'unsupported_media_type' | 'forbidden_origin' | 'idempotency_conflict' }
  | { code: 'rate_limited'; retryAfterSeconds: number }
  | { code: 'validation_failed'; fields: WaitlistErrors };
export type WaitlistUnavailable = { code: 'enrollment_disabled' | 'processing_unconfirmed' };
export type WaitlistProcessed = { status: 'processed'; withdrawalReceipt: string };
export type WaitlistResponse = WaitlistFailure | WaitlistUnavailable | WaitlistProcessed;
export type WaitlistValidation = { valid: true; value: WaitlistRequest } | { valid: false; error: WaitlistFailure };
export type WaitlistTransport = (request: WaitlistRequest) => Promise<WaitlistResponse>;

export function waitlistErrorMessage(field: WaitlistField, code: WaitlistFieldError): string {
  if (code === 'version_changed') return 'The notice has changed. Please review it again.';
  if (field === 'consent') return 'Please agree to the city-availability notification.';
  if (code === 'place_required') return 'Choose a place from the results or use the missing-place option.';
  if (code === 'email_policy_unresolved') return 'Support for internationalized email addresses is not yet confirmed.';
  if (code === 'required') return field === 'country' ? 'Please select your country.' : `Please enter your ${field}.`;
  if (code === 'too_long') return field === 'city' ? 'Use no more than 120 characters for your city.' : 'Use no more than 254 characters for your email address.';
  return field === 'country' ? 'Please select a recognized country.' : field === 'city' ? 'Please enter a city without control characters.' : 'Please enter a valid email address.';
}
