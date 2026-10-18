import { enrollmentAllowed } from './release';
import { createWaitlistService } from './service';
import { neonSql } from './neon';

export async function waitlistHandler(request: Request, action: 'register' | 'withdrawal' | 'deletion' = 'register') {
  if (!enrollmentAllowed()) return Response.json({ code: 'enrollment_disabled' }, { status: 503, headers: { 'Cache-Control': 'no-store', 'CDN-Cache-Control': 'no-store', 'Vercel-CDN-Cache-Control': 'no-store' } });
  try {
    const origin = process.env.WAITLIST_ORIGIN;
    const connectionString = process.env.WAITLIST_DATABASE_URL;
    if (!origin || !connectionString || process.env.VERCEL !== '1') throw new Error('Unavailable');
    return await createWaitlistService({ enabled: true, origin, sql: neonSql(connectionString), networkAddress: req => req.headers.get('x-vercel-forwarded-for') || 'unknown-network' })(request, action);
  } catch {
    return Response.json({ code: 'enrollment_disabled' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }
}
