'use client';

import { useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/lib/auth-context';
import { db } from '@/lib/firebase';

export function PresenceTracker() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const ping = async () => {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          lastSeenAt: Date.now(),
        });
      } catch {
        // silent fail — never crash the app
      }
    };

    ping();
    const intervalId = setInterval(ping, 60_000);

    const onVisibility = () => {
      if (document.visibilityState === 'visible') ping();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [user]);

  return null;
}
