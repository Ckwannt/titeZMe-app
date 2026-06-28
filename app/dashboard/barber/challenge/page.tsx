'use client';

import { useAuth } from '@/lib/auth-context';
import ChallengeSubmissionTab from '@/components/ChallengeSubmissionTab';
import ChallengeLocationGate from '@/components/ChallengeLocationGate';

export default function Page() {
  const { appUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <ChallengeLocationGate
      country={appUser?.country}
      settingsHref="/dashboard/barber/settings"
    >
      <ChallengeSubmissionTab mode="barber" />
    </ChallengeLocationGate>
  );
}
