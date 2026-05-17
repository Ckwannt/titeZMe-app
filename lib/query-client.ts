/**
 * Singleton QueryClient exported so it can be imported in non-React contexts
 * (e.g. lib/invalidate.ts) as well as in the provider.
 *
 * staleTime reduced to 30 s (from 5 min) so profile/service/schedule changes
 * appear on public pages within 30 s even without explicit invalidation.
 */
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,       // 30 s — mutable data needs short TTL
      gcTime: 5 * 60 * 1000,      // 5 min in memory cache
      retry: 2,
      refetchOnWindowFocus: true,  // Refresh when user returns to tab
      refetchInterval: false,      // No polling — we use onSnapshot / manual invalidation
    },
  },
});
