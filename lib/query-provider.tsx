'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { ReactNode } from 'react';
import { queryClient } from './query-client';

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
