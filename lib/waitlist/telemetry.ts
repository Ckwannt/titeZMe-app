export function isPrivateWaitlistPath(value: string) {
  return /(?:^|\s|https?:\/\/[^/]+)\/(?:api\/(?:waitlist|places)(?:\/|\?|$)|(?:\?|$))/.test(value) || /https?:\/\/[^/]*\.neon\.tech\//.test(value);
}
export function privateWaitlistEvent(event: { request?: { url?: string }; transaction?: string }) {
  return isPrivateWaitlistPath(event.request?.url || '') || isPrivateWaitlistPath(event.transaction || '');
}
