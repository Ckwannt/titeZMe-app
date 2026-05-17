/**
 * Cache-invalidation helpers.
 * Call these after every Firestore write so React Query caches are flushed
 * and UIs refresh without waiting for staleTime to expire.
 *
 * Uses the singleton queryClient from lib/query-client.ts so this file
 * can be imported from both React components and plain TS modules.
 */
import { queryClient } from './query-client';

/** Invalidate all cached data for a specific barber (by their uid). */
export function invalidateBarber(uid: string): void {
  // Dashboard queries (barber's own data)
  queryClient.invalidateQueries({ queryKey: ['profile', uid] });
  queryClient.invalidateQueries({ queryKey: ['schedule', uid] });
  queryClient.invalidateQueries({ queryKey: ['services', uid] });
  queryClient.invalidateQueries({ queryKey: ['barberSchedule', uid] });

  // Public profile queries (what visitors / clients see)
  queryClient.invalidateQueries({ queryKey: ['barberPublicProfile', uid] });
  queryClient.invalidateQueries({ queryKey: ['barberPublicServices', uid] });
  queryClient.invalidateQueries({ queryKey: ['barberPublicReviews', uid] });
  queryClient.invalidateQueries({ queryKey: ['bookProfile', uid] });
  queryClient.invalidateQueries({ queryKey: ['bookServices', uid] });

  // List pages
  queryClient.invalidateQueries({ queryKey: ['barbersListV2'] });
}

/** Invalidate all cached data for a specific shop. */
export function invalidateShop(shopId: string): void {
  // Dashboard / public profile
  queryClient.invalidateQueries({ queryKey: ['shop', shopId] });
  queryClient.invalidateQueries({ queryKey: ['shopSchedule', shopId] });
  queryClient.invalidateQueries({ queryKey: ['shopServices', shopId] });

  // List pages
  queryClient.invalidateQueries({ queryKey: ['shopsListV2'] });
}
