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
