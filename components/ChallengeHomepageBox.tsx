'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import {
  doc, getDoc, collection, query, where, getCountFromServer,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n/LangContext';
import type { ChallengeSettings } from '@/lib/types';
import CountdownTimer from './CountdownTimer';

type Phase = 'preOpen' | 'entry' | 'gap' | 'voting' | 'closed' | 'hidden';

export default function ChallengeHomepageBox() {
  const { user, appUser, loading: authLoading } = useAuth();
  const { t } = useLang();

  const { data: settings } = useQuery({
    queryKey: ['challenge_settings'],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'siteConfig', 'challenge'));
      return snap.exists() ? (snap.data() as ChallengeSettings) : null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: counts = { barbers: 0, shops: 0 } } = useQuery({
    queryKey: ['challenge_counts'],
    queryFn: async () => {
      const [bSnap, sSnap] = await Promise.all([
        getCountFromServer(query(
          collection(db, 'challengeSubmissions'),
          where('type', '==', 'barber'),
          where('status', '==', 'approved'),
        )),
        getCountFromServer(query(
          collection(db, 'challengeSubmissions'),
          where('type', '==', 'shop'),
          where('status', '==', 'approved'),
        )),
      ]);
      return { barbers: bSnap.data().count, shops: sSnap.data().count };
    },
    staleTime: 5 * 60 * 1000,
  });

  const now = Date.now();
  let phase: Phase = 'hidden';

  if (!settings?.showHomepageBox) {
    phase = 'hidden';
  } else if (now < (settings?.submissionsOpenAt ?? 0)) {
    phase = 'preOpen';
  } else if (now < (settings?.submissionsCloseAt ?? 0)) {
    phase = 'entry';
  } else if (now < (settings?.votingOpenAt ?? 0)) {
    phase = 'gap';
  } else if (now < (settings?.votingCloseAt ?? 0)) {
    phase = 'voting';
  } else {
    phase = 'closed';
  }

  if (phase === 'hidden' || phase === 'closed' || !settings) return null;

  if (phase === 'gap') {
    return (
      <div className="w-full rounded-2xl border border-gray-200 bg-gray-50 p-6 text-center">
        <div className="text-2xl mb-2">⏳</div>
        <p className="text-sm font-medium text-gray-700">
          {t('landing.challenge.votingComingSoon') ?? 'Voting opens soon — stay tuned.'}
        </p>
      </div>
    );
  }

  function getCTA(): { label: string; href: string } {
    if (authLoading) {
      return { label: t('landing.challenge.ctaSignup'), href: '/signup' };
    }
    if (!user || !appUser) {
      return { label: t('landing.challenge.ctaSignup'), href: '/signup' };
    }
    if (phase === 'voting') {
      return { label: t('landing.challenge.ctaVote'), href: '/challenge' };
    }
    if (appUser.role === 'barber' && !appUser.ownsShop) {
      return { label: t('landing.challenge.ctaSubmit'), href: '/dashboard/barber/challenge' };
    }
    if (appUser.ownsShop) {
      return { label: t('landing.challenge.ctaSubmit'), href: '/dashboard/shop/challenge' };
    }
    return { label: t('landing.challenge.ctaWaitVote'), href: '/about' };
  }

  const cta = getCTA();
  const shopAmount = `€${(settings.prizeShopValue ?? 100000).toLocaleString('es-ES')}`;
  const barberAmount = `€${(settings.prizeBarberValue ?? 12000).toLocaleString('es-ES')}`;

  return (
    <div className="flex-1 lg:max-w-[440px] animate-fadeUp mt-10 lg:mt-0">
      <div className="relative bg-[#111] border-2 border-brand-orange/40 rounded-[16px] p-6 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-orange/5 to-transparent pointer-events-none" />

        <div className="relative">
          <div className="inline-block text-[10px] font-black tracking-[3px] text-brand-orange uppercase mb-4">
            🏆 {t('landing.challenge.label')}
          </div>

          {phase === 'preOpen' && (
            <div className="text-[#888] text-xs mb-3 uppercase tracking-widest">
              {t('landing.challenge.opensIn')}{' '}
              <CountdownTimer targetMs={settings.submissionsOpenAt} className="text-brand-yellow font-bold" />
            </div>
          )}
          {phase === 'entry' && (
            <div className="text-[#888] text-xs mb-3 uppercase tracking-widest">
              {t('landing.challenge.closesIn')}{' '}
              <CountdownTimer targetMs={settings.submissionsCloseAt} className="text-brand-yellow font-bold" />
            </div>
          )}
          {phase === 'voting' && (
            <div className="text-[#888] text-xs mb-3 uppercase tracking-widest">
              {t('landing.challenge.votingEndsIn')}{' '}
              <CountdownTimer targetMs={settings.votingCloseAt} className="text-brand-yellow font-bold" />
            </div>
          )}

          <div className="mb-2">
            <div className="text-brand-yellow text-3xl md:text-4xl font-black leading-none">
              {t('landing.challenge.win')} {shopAmount}
            </div>
            <div className="text-[#888] text-[11px] uppercase tracking-widest mt-1">
              {t('landing.challenge.forBarbershops')}
            </div>
          </div>
          <div className="mb-5">
            <div className="text-brand-yellow text-2xl md:text-3xl font-black leading-none">
              {t('landing.challenge.win')} {barberAmount}
            </div>
            <div className="text-[#888] text-[11px] uppercase tracking-widest mt-1">
              {t('landing.challenge.forBarbers')}
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-[#1e1e1e] rounded-[10px] p-3 mb-5">
            <div className="text-[#888] text-[11px] uppercase tracking-widest mb-1">
              {t('landing.challenge.participating')}
            </div>
            <div className="text-white text-sm font-bold">
              {(settings.fakeBarberCount || 0) + counts.barbers} {t('landing.challenge.barbers')} ·{' '}
              {(settings.fakeShopCount || 0) + counts.shops} {t('landing.challenge.shops')}
            </div>
          </div>

          <Link
            href={cta.href}
            className="block w-full bg-brand-yellow text-[#0a0a0a] font-black text-sm px-5 py-3 rounded-xl text-center hover:bg-brand-yellow/90 transition-colors"
          >
            {cta.label}
          </Link>

          <Link
            href="/terms/challenge"
            className="block text-[#666] text-[10px] mt-3 text-center hover:text-[#888]"
          >
            {t('landing.challenge.smallPrint')}
          </Link>
        </div>
      </div>
    </div>
  );
}
