import { searchPlaces, PlaceSearchBusyError } from '../../../lib/waitlist/places';

export const runtime = 'nodejs';
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store', 'Content-Type': 'application/json' };
  // Location search stays on this server; never forward visitor queries to GeoNames.
  if (request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({ places: [] }, { status: 403, headers });
  if (Number(request.headers.get('content-length') || 0) > 1024) return Response.json({ places: [] }, { status: 413, headers });
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ places: [] }, { status: 400, headers });
  let timer: ReturnType<typeof setTimeout> | undefined;
  const deadline = new Promise<never>((_, reject) => { timer = setTimeout(() => { void reader.cancel().catch(() => undefined); reject(new Error('Body timeout')); }, 3000); });
  try {
    const chunks: Uint8Array[] = []; let size = 0;
    while (true) {
      const result = await Promise.race([reader.read(), deadline]);
      if (result.done) break;
      size += result.value.byteLength;
      if (size > 1024) { void reader.cancel(); return Response.json({ places: [] }, { status: 413, headers }); }
      chunks.push(result.value);
    }
    const input: unknown = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(chunks)));
    if (!input || typeof input !== 'object' || Array.isArray(input) || Object.keys(input).sort().join(',') !== 'country,query') return Response.json({ places: [] }, { status: 400, headers });
    const { country, query } = input as { country: unknown; query: unknown };
    if (typeof country !== 'string' || typeof query !== 'string') return Response.json({ places: [] }, { status: 400, headers });
    return Response.json({ places: await searchPlaces(country, query) }, { headers });
  } catch (error) { return Response.json({ places: [] }, { status: error instanceof PlaceSearchBusyError ? 429 : 400, headers: error instanceof PlaceSearchBusyError ? { ...headers, 'Retry-After': '1' } : headers }); }
  finally { clearTimeout(timer); reader.releaseLock(); }
}
