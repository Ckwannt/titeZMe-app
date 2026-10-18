import { waitlistHandler } from '../../../../lib/waitlist/runtime';
export function POST(request: Request) { return waitlistHandler(request, 'deletion'); }
