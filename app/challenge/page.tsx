'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { ChallengeSettings } from '@/lib/types';
import Link from 'next/link';

export default function ChallengePage() {
  const [settings, setSettings] = useState<ChallengeSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const snap = await getDoc(doc(db, 'siteConfig', 'challenge'));
        if (snap.exists()) setSettings(snap.data() as ChallengeSettings);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#666] text-sm">
        Loading…
      </div>
    );
  }

  const now = Date.now();
  const votingNotYetOpen = !settings || !settings.votingOpenAt || now < settings.votingOpenAt;
  const votingClosed = settings && settings.votingCloseAt && now >= settings.votingCloseAt;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-[640px] text-center">
        <div className="inline-block text-[10px] font-black tracking-[3px] text-brand-orange uppercase mb-4">
          🏆 Challenge 2026
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">
          {votingNotYetOpen ? 'Voting opens soon' : votingClosed ? 'Voting has closed' : 'Vote'}
        </h1>
        <p className="text-[#888] text-sm mb-8">
          {votingNotYetOpen
            ? `Public voting will open ${settings?.votingOpenAt ? new Date(settings.votingOpenAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'soon'}. Come back then to vote for your favorite barbers and barbershops.`
            : votingClosed
            ? 'Voting has closed. Winners will be announced at the public event on September 17, 2026.'
            : 'The full voting page is coming soon.'}
        </p>
        <Link href="/" className="inline-block bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl">
          Back to home
        </Link>
      </div>
    </div>
  );
}
