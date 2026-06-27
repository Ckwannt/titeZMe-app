'use client';

import { useAuth } from '@/lib/auth-context';
import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ChallengeSubmissionTab from '@/components/ChallengeSubmissionTab';
import ChallengeLocationGate from '@/components/ChallengeLocationGate';

export default function Page() {
  const { user, loading: authLoading } = useAuth();

  const { data: shopSnap, isLoading: shopLoading } = useQuery({
    queryKey: ['shop', user?.uid],
    queryFn: () => getDoc(doc(db, 'barbershops', user!.uid)),
    enabled: !!user?.uid,
    staleTime: 5 * 60 * 1000,
  });

  if (authLoading || shopLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const shopCountry = shopSnap?.data()?.address?.country;

  return (
    <ChallengeLocationGate country={shopCountry}>
      <ChallengeSubmissionTab mode="shop" />
    </ChallengeLocationGate>
  );
}
