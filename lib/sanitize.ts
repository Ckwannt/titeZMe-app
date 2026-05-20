/**
 * Input sanitization helpers for titeZMe.
 * Call these before writing user-entered text to Firestore.
 */

export function sanitizeText(input: string, maxLength: number = 500): string {
  if (!input || typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .replace(/\\/g, '&#x5C;')
    .replace(/`/g, '&#96;');
}

export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) return '';
  if (trimmed.toLowerCase().includes('javascript:')) return '';
  return trimmed.slice(0, 500);
}

export function sanitizeHandle(handle: string): string {
  if (!handle || typeof handle !== 'string') return '';
  return handle
    .trim()
    .replace(/[^a-zA-Z0-9._-]/g, '')
    .slice(0, 100);
}

export function sanitizeBarberCode(input: string): string {
  return input.replace(/[^A-Z0-9-]/g, '').toUpperCase().slice(0, 10);
}

export function sanitizePhone(input: unknown): string {
  if (!input || typeof input !== 'string') return '';
  return input.trim().replace(/[^0-9+\-\s()]/g, '').slice(0, 20);
}

export function sanitizeProfileData(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    firstName: sanitizeText(data.firstName, 100),
    lastName: sanitizeText(data.lastName, 100),
    bio: sanitizeText(data.bio, 2000),
    phone: sanitizePhone(data.phone),
    city: sanitizeText(data.city, 100),
  };
}

export function sanitizeServiceData(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    name: sanitizeText(data.name, 100),
    description: sanitizeText(data.description || '', 500),
  };
}

export function sanitizeReviewData(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    comment: sanitizeText(data.comment || '', 1000),
    clientName: sanitizeText(data.clientName, 100),
  };
}

export function sanitizeShopData(data: Record<string, any>): Record<string, any> {
  return {
    ...data,
    name: sanitizeText(data.name, 100),
    description: sanitizeText(data.description || '', 2000),
    googleMapsUrl: sanitizeUrl(data.googleMapsUrl),
  };
}
