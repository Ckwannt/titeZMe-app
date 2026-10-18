import { waitlistHandler } from '../../../lib/waitlist/runtime';

export const dynamic = 'force-dynamic';

export function POST(request: Request) {
  return waitlistHandler(request);
}
