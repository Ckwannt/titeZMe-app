'use client';

import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';

export function useShowFakeUIData(): boolean {
  const { data } = useQuery({
    queryKey: ['siteConfig_showFakeUIData'],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'siteConfig', 'global'));
      if (!snap.exists()) return true; // default ON
      const val = (snap.data() as { showFakeUIData?: boolean }).showFakeUIData;
      return val !== false;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return data !== false;
}
