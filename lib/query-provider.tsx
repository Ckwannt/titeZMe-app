'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactNode, useState } from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes before refetch
      gcTime: 10 * 60 * 1000,     // 10 minutes in cache
      retry: 2,
      refetchOnWindowFocus: true,  // Refresh when user returns to tab
      refetchInterval: false,      // No polling by default
    },
  },
});

// Persist to sessionStorage so dashboard data survives tab navigation
// without re-fetching Firestore on every page visit within a session.
const persister = typeof window !== 'undefined'
  ? createSyncStoragePersister({
      storage: window.sessionStorage,
    })
  : undefined;

export default function Providers({ children }: { children: ReactNode }) {
  if (persister) {
    return (
      <PersistQueryClientProvider
        client={queryClient}
        persistOptions={{ persister, maxAge: 5 * 60 * 1000 }}
      >
        {children}
      </PersistQueryClientProvider>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
