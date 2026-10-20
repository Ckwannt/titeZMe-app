/** Protected previews contain only the launch page; production behavior is unchanged. */
export function isIsolatedPreview(): boolean {
  return process.env.VERCEL_ENV === 'preview';
}

export function isPreviewPathAllowed(pathname: string, imageSource: string | null = null): boolean {
  if (pathname === '/_next/image') return !!imageSource && imageSource.startsWith('/launch/') && !imageSource.includes('..');
  return pathname === '/' || pathname.startsWith('/_next/static/') || pathname.startsWith('/launch/')
    || ['/api/places', '/api/waitlist', '/api/waitlist/withdraw', '/api/waitlist/delete', '/favicon.ico', '/favicon-96x96.png', '/apple-touch-icon.png', '/site.webmanifest', '/web-app-manifest-192x192.png', '/web-app-manifest-512x512.png'].includes(pathname);
}
