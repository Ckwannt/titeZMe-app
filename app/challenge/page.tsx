'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  doc, getDoc, setDoc,
  collection, query, where, orderBy, limit, getDocs,
} from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { algoliasearch } from 'algoliasearch';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n/LangContext';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/lib/toast';
import CountdownTimer from '@/components/CountdownTimer';
import type { ChallengeSettings, ChallengeSubmission } from '@/lib/types';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export default function ChallengePage() {
  const { user, appUser } = useAuth();
  const router = useRouter();
  const { t, lang } = useLang();

  const { data: settings, isLoading: settingsLoading } = useQuery({
    queryKey: ['challenge_settings'],
    queryFn: async () => {
      const snap = await getDoc(doc(db, 'siteConfig', 'challenge'));
      return snap.exists() ? (snap.data() as ChallengeSettings) : null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const [barberHits, setBarberHits] = useState<any[]>([]);
  const [shopHits, setShopHits] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const [nameSearch, setNameSearch] = useState('');
  const debouncedSearch = useDebounce(nameSearch, 300);

  const [justVotedBarber, setJustVotedBarber] = useState<string | null>(null);
  const [justVotedShop, setJustVotedShop] = useState<string | null>(null);
  const [voting, setVoting] = useState<string | null>(null);

  const [verifyingEmail, setVerifyingEmail] = useState(false);
  // Re-render after auth.currentUser.reload() — context user ref doesn't change.
  const [verifiedTick, setVerifiedTick] = useState(0);

  // Algolia search (on debounced query change)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setSearching(true);
      try {
        const { results } = await algoliaClient.search({
          requests: [
            { indexName: 'challenge_barbers', query: '', hitsPerPage: 100 },
            { indexName: 'challenge_shops', query: '', hitsPerPage: 100 },
          ],
        });
        if (cancelled) return;

        const barberRaw = ((results[0] as any).hits as any[]) || [];
        const shopRaw = ((results[1] as any).hits as any[]) || [];

        const q = debouncedSearch.trim().toLowerCase();
        const filt = (h: any) =>
          !q || (h.submitterName || '').toLowerCase().includes(q);

        setBarberHits(barberRaw.filter(filt));
        setShopHits(shopRaw.filter(filt));
      } catch {
        if (!cancelled) {
          setBarberHits([]);
          setShopHits([]);
        }
      } finally {
        if (!cancelled) setSearching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [debouncedSearch]);

  const now = Date.now();
  const phase =
    !settings
      ? 'loading'
      : !settings.votingOpenAt || !settings.votingCloseAt
      ? 'misconfigured'
      : now < settings.submissionsOpenAt
      ? 'preOpen'
      : now < settings.submissionsCloseAt
      ? 'entry'
      : now < settings.votingOpenAt
      ? 'gap'
      : now < settings.votingCloseAt
      ? 'voting'
      : 'closed';

  const leaderboardEnabled =
    phase === 'voting' && !!settings?.publicLeaderboardEnabled;

  const { data: barberLeaderboard = [], isLoading: lbBarberLoading } = useQuery({
    queryKey: ['challenge_leaderboard', 'barber'],
    queryFn: async () => {
      const q = query(
        collection(db, 'challengeSubmissions'),
        where('type', '==', 'barber'),
        where('status', '==', 'approved'),
        orderBy('voteCount', 'desc'),
        limit(20),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as ChallengeSubmission) }));
    },
    staleTime: 5 * 60 * 1000,
    enabled: leaderboardEnabled,
  });

  const { data: shopLeaderboard = [], isLoading: lbShopLoading } = useQuery({
    queryKey: ['challenge_leaderboard', 'shop'],
    queryFn: async () => {
      const q = query(
        collection(db, 'challengeSubmissions'),
        where('type', '==', 'shop'),
        where('status', '==', 'approved'),
        orderBy('voteCount', 'desc'),
        limit(20),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...(d.data() as ChallengeSubmission) }));
    },
    staleTime: 5 * 60 * 1000,
    enabled: leaderboardEnabled,
  });

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText('https://titezme.com/challenge');
    toast.success(t('challenge.public.toastShareCopied'));
  }, [t]);

  const handleResendVerification = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success(t('challenge.public.toastVerifySent'));
    } catch {
      toast.error(t('challenge.public.toastVerifySendFail'));
    }
  }, [t]);

  const handleVerifyRefresh = useCallback(async () => {
    if (!auth.currentUser) return;
    setVerifyingEmail(true);
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      setVerifiedTick(prev => prev + 1);
      if (auth.currentUser?.emailVerified) {
        toast.success(t('challenge.public.toastVerifyOk'));
      } else {
        toast.error(t('challenge.public.toastVerifyStill'));
      }
    } catch {
      toast.error(t('challenge.public.toastVerifyRefreshFail'));
    } finally {
      setVerifyingEmail(false);
    }
  }, [t]);

  async function handleVote(hit: any, type: 'barber' | 'shop') {
    if (!user) {
      router.push('/signup?next=/challenge');
      return;
    }
    const verifiedNow = auth.currentUser?.emailVerified ?? user.emailVerified;
    if (!verifiedNow) {
      toast.error(t('challenge.public.toastNeedVerify'));
      return;
    }
    if (phase !== 'voting') {
      toast.error(t('challenge.public.toastNotOpen'));
      return;
    }
    setVoting(hit.objectID);
    try {
      await setDoc(doc(db, 'challengeVotes', `${user.uid}_${type}`), {
        voterUid: user.uid,
        type,
        submissionId: hit.objectID,
        votedAt: Date.now(),
      });
      if (type === 'barber') setJustVotedBarber(hit.objectID);
      else setJustVotedShop(hit.objectID);
      toast.success(t('challenge.public.toastVoteOk'));
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        toast.error(t('challenge.public.toastVoteClosedOrDup'));
      } else {
        toast.error(t('challenge.public.toastVoteFail'));
      }
    } finally {
      setVoting(null);
    }
  }

  // ─── Render branches ─────────────────────────────────────────────────────

  if (settingsLoading || phase === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#666] text-sm">
        {t('challenge.public.loading')}
      </div>
    );
  }

  if (phase === 'misconfigured') {
    return (
      <SimpleMessage
        title={t('challenge.public.misconfTitle')}
        body={t('challenge.public.misconfBody')}
      />
    );
  }

  if (phase === 'preOpen' || phase === 'entry' || phase === 'gap') {
    return <PreVotingScreen settings={settings!} phase={phase} />;
  }

  if (phase === 'closed') {
    const formattedEventDate = settings?.eventDate
      ? new Date(settings.eventDate).toLocaleDateString(
          lang === 'fr' ? 'fr-FR' : lang === 'es' ? 'es-ES' : 'en-GB',
          { day: 'numeric', month: 'long', year: 'numeric' }
        )
      : '17 September 2026';
    return (
      <SimpleMessage
        title={t('challenge.eventClosedTitle')}
        body={`${t('challenge.eventClosedBody')} ${formattedEventDate}.`}
      />
    );
  }

  // ─── phase === 'voting' ──────────────────────────────────────────────────

  const emailVerifiedNow =
    (auth.currentUser?.emailVerified ?? user?.emailVerified) === true;
  // Note: verifiedTick referenced to keep eslint quiet about its purpose.
  void verifiedTick;

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">
      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-16">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-block text-[10px] font-black tracking-[3px] text-brand-orange uppercase mb-4">
            🏆 {t('challenge.public.eyebrow')}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            {t('challenge.public.headerTitle')}
          </h1>
          <p className="text-[#888] text-sm md:text-base">
            {t('challenge.public.votingClosesIn')}{' '}
            <CountdownTimer
              targetMs={settings!.votingCloseAt}
              className="text-brand-yellow font-bold"
            />
          </p>
        </div>

        {/* Share button (visible to all states) */}
        <div className="mb-6">
          <button
            onClick={handleShare}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold text-xs px-4 py-2 rounded-full hover:border-[#444] transition-colors"
          >
            {t('challenge.public.shareBtn')}
          </button>
        </div>

        {/* Auth / verify gate */}
        {!user ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-[16px] p-6 mb-8">
            <h2 className="text-lg font-black mb-2">{t('challenge.public.signupTitle')}</h2>
            <p className="text-[#888] text-sm mb-4">
              {t('challenge.public.signupBody')}
            </p>
            <Link
              href="/signup"
              className="inline-block bg-brand-yellow text-[#0a0a0a] font-black text-sm px-5 py-3 rounded-xl hover:bg-brand-yellow/90 transition-colors"
            >
              {t('challenge.public.signupBtn')}
            </Link>
          </div>
        ) : !emailVerifiedNow ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-[16px] p-6 mb-8">
            <h2 className="text-lg font-black mb-2">{t('challenge.public.verifyTitle')}</h2>
            <p className="text-[#888] text-sm mb-4">
              {t('challenge.public.verifyBody')
                .split('{email}')
                .flatMap((part, i, arr) =>
                  i < arr.length - 1
                    ? [part, <span key={i} className="text-white font-bold">{user.email}</span>]
                    : [part]
                )}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleResendVerification}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:border-[#444] transition-colors"
              >
                {t('challenge.public.resendBtn')}
              </button>
              <button
                onClick={handleVerifyRefresh}
                disabled={verifyingEmail}
                className="bg-brand-yellow text-[#0a0a0a] font-black text-sm px-4 py-2.5 rounded-xl hover:bg-brand-yellow/90 disabled:opacity-50"
              >
                {verifyingEmail ? t('challenge.public.checkingBtn') : t('challenge.public.refreshBtn')}
              </button>
            </div>
          </div>
        ) : (
          // Signed in + verified → search bar
          <div className="mb-8">
            <input
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
              placeholder={t('challenge.public.searchPlaceholder')}
              className="w-full sm:max-w-md bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]"
            />
            <div className="text-xs text-[#666] mt-2">
              {t('challenge.public.showingCount')
                .replace('{b}', String(barberHits.length))
                .replace('{s}', String(shopHits.length))}
            </div>
          </div>
        )}

        {leaderboardEnabled && !debouncedSearch.trim() ? (
          <>
            <Leaderboard
              title={t('challenge.public.topBarbers')}
              data={barberLeaderboard}
              loading={lbBarberLoading}
              type="barber"
              appUser={appUser}
              justVotedBarber={justVotedBarber}
              justVotedShop={justVotedShop}
              voting={voting}
              canVote={!!user && emailVerifiedNow}
              onVote={handleVote}
            />
            <Leaderboard
              title={t('challenge.public.topShops')}
              data={shopLeaderboard}
              loading={lbShopLoading}
              type="shop"
              appUser={appUser}
              justVotedBarber={justVotedBarber}
              justVotedShop={justVotedShop}
              voting={voting}
              canVote={!!user && emailVerifiedNow}
              onVote={handleVote}
            />
          </>
        ) : (
          <>
            {/* Section: Barbers */}
            <section className="mb-12">
              <h2 className="text-xl font-black mb-4">
                {t('challenge.public.sectionBarbers').replace('{n}', String(barberHits.length))}
              </h2>
              <SubmissionGrid
                hits={barberHits}
                type="barber"
                searching={searching}
                appUser={appUser}
                justVotedBarber={justVotedBarber}
                justVotedShop={justVotedShop}
                voting={voting}
                canVote={!!user && emailVerifiedNow}
                onVote={handleVote}
              />
            </section>

            {/* Section: Barbershops */}
            <section className="mb-12">
              <h2 className="text-xl font-black mb-4">
                {t('challenge.public.sectionShops').replace('{n}', String(shopHits.length))}
              </h2>
              <SubmissionGrid
                hits={shopHits}
                type="shop"
                searching={searching}
                appUser={appUser}
                justVotedBarber={justVotedBarber}
                justVotedShop={justVotedShop}
                voting={voting}
                canVote={!!user && emailVerifiedNow}
                onVote={handleVote}
              />
            </section>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function SimpleMessage({ title, body }: { title: string; body: string }) {
  const { t } = useLang();
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-[640px] text-center">
        <div className="inline-block text-[10px] font-black tracking-[3px] text-brand-orange uppercase mb-4">
          🏆 {t('challenge.public.eyebrow')}
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">{title}</h1>
        <p className="text-[#888] text-sm mb-8">{body}</p>
        <Link
          href="/"
          className="inline-block bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl"
        >
          {t('challenge.public.backHome')}
        </Link>
      </div>
    </div>
  );
}

function PreVotingScreen({ settings, phase }: {
  settings: ChallengeSettings
  phase: string
}) {
  const { t } = useLang()

  const prizeShop = settings.prizeShopValue
    ? new Intl.NumberFormat('es-ES').format(settings.prizeShopValue)
    : '100.000'
  const prizeBarber = settings.prizeBarberValue
    ? new Intl.NumberFormat('es-ES').format(settings.prizeBarberValue)
    : '15.000'
  const feeShop: number = (settings as any).feeShop ?? 99
  const feeBarber: number = (settings as any).feeBarber ?? 49

  const countdownTarget = (() => {
    const val: any = phase === 'entry' ? settings.submissionsCloseAt : settings.votingOpenAt
    if (!val) return null
    if (typeof val === 'number') return new Date(val)
    if (val instanceof Date) return val as Date
    return val.toDate() as Date
  })()

  const countdownLabel = phase === 'entry'
    ? t('challenge.public.countdownSubmissionsLabel')
    : t('challenge.public.countdownVotingLabel')

  const eventDateFormatted = settings.eventDate
    ? new Date(settings.eventDate)
        .toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
        .replace(/\//g, '.')
    : '17.09.2026'

  const withFees = (key: string) =>
    (t as any)(key)
      .replace('{shop}', String(feeShop))
      .replace('{barber}', String(feeBarber))

  return (
    <div className="bg-black text-white">

      {/* ── 1. HERO ── */}
      <section className="px-6 py-24 lg:py-32 relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage: `radial-gradient(ellipse at 80% 10%, #FF5500 0%, transparent 55%),
                              radial-gradient(ellipse at 10% 90%, #FFD700 0%, transparent 55%)`,
          }}
        />
        <div className="relative z-10 max-w-5xl mx-auto">
          <p className="text-xs font-mono tracking-[0.35em] text-yellow-400 uppercase mb-10">
            {t('challenge.public.heroEyebrow')}
          </p>
          <div className="lg:grid lg:grid-cols-2 lg:gap-20 items-start">

            {/* Left — tagline + possibilities */}
            <div>
              <h1 className="text-4xl lg:text-6xl font-black text-yellow-400 leading-tight mb-8">
                {t('challenge.public.heroTagline')}
              </h1>
              <p className="text-lg text-gray-400 mb-4">{t('challenge.public.heroPossibilities')}</p>
              <ul className="space-y-3 mb-8">
                {[1,2,3,4,5,6].map(i => (
                  <li key={i} className="flex items-start gap-3 text-white text-lg">
                    <span className="text-yellow-400 mt-1 shrink-0">—</span>
                    <span>{(t as any)(`challenge.public.heroPossibility${i}`)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xl font-bold text-white">
                {t('challenge.public.heroConclusion')}
              </p>
            </div>

            {/* Right — prize box + countdown + CTAs */}
            <div className="mt-12 lg:mt-0">
              <div className="border border-yellow-400/20 rounded-2xl p-8 bg-gray-950">
                <div className="mb-8">
                  <p className="text-6xl lg:text-7xl font-black text-yellow-400 leading-none">
                    €{prizeShop}
                  </p>
                  <p className="text-gray-400 mt-2 text-sm">
                    {t('challenge.public.heroShopsWin')}
                  </p>
                </div>
                <div className="w-full h-px bg-gray-800 mb-8" />
                <div>
                  <p className="text-5xl font-black text-yellow-400 leading-none">
                    €{prizeBarber}
                  </p>
                  <p className="text-gray-400 mt-2 text-sm">
                    {t('challenge.public.heroBarbersWin')}
                  </p>
                </div>
              </div>

              {countdownTarget && (
                <div className="mt-6 p-5 border border-gray-800 rounded-xl bg-gray-950">
                  <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-3">
                    {countdownLabel}
                  </p>
                  <CountdownTimer targetMs={countdownTarget.getTime()} />
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="/dashboard/barber/challenge"
                  className="block w-full text-center py-4 px-6 bg-yellow-400 text-black font-black text-base uppercase tracking-wider rounded-xl hover:bg-yellow-300 transition-colors"
                >
                  {t('challenge.public.ctaBarberBtn')}
                </a>
                <a
                  href="/dashboard/shop/challenge"
                  className="block w-full text-center py-4 px-6 border border-yellow-400 text-yellow-400 font-black text-base uppercase tracking-wider rounded-xl hover:bg-yellow-400 hover:text-black transition-colors"
                >
                  {t('challenge.public.ctaShopBtn')}
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 2. HOW? ── */}
      <section className="border-t border-gray-900 px-6 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-6xl font-black text-yellow-400 mb-6">
            {t('challenge.public.howQuestion')}
          </p>
          <p className="text-2xl lg:text-3xl font-bold text-orange-500 leading-snug mb-12">
            {t('challenge.public.howSubtitle')}
          </p>
          <div className="space-y-4">
            {([1,2,3,4,5] as const).map(i => (
              <div
                key={i}
                className="flex gap-6 lg:gap-8 items-start p-6 lg:p-8 bg-gray-950 rounded-2xl border border-gray-800"
              >
                <span className="text-4xl lg:text-5xl font-black text-orange-500 leading-none w-12 shrink-0">
                  {i}
                </span>
                <div>
                  <h3 className="text-lg lg:text-xl font-black text-white mb-2">
                    {(t as any)(`challenge.public.howStep${i}Title`)}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {withFees(`challenge.public.howStep${i}Body`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-10 text-xl font-bold text-white leading-relaxed border-l-2 border-yellow-400 pl-6">
            {t('challenge.public.howConclusion')}
          </p>
        </div>
      </section>

      {/* ── 3. MEET THE CEO ── */}
      <section className="border-t border-gray-900 lg:grid lg:grid-cols-2">
        {/* Photo */}
        <div className="relative" style={{ minHeight: '520px' }}>
          <Image
            src="/ckwant-challenge.png"
            alt={t('challenge.public.ceoAlt')}
            fill
            className="object-cover object-top"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-black" />
          {/* Mobile caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:hidden">
            <p className="text-xs font-mono tracking-widest text-yellow-400 uppercase mb-2">
              {t('challenge.public.ceoRoleLabel')}
            </p>
            <p className="text-3xl font-black text-white">{t('challenge.public.ceoPhotoCaption')}</p>
            <p className="text-2xl font-black text-yellow-400 mt-1">{t('challenge.public.ceoPhotoCaptionBold')}</p>
          </div>
        </div>
        {/* Text — desktop only */}
        <div className="px-6 py-12 lg:px-12 lg:py-20 bg-black flex flex-col justify-center">
          <p className="text-xs font-mono tracking-widest text-yellow-400 uppercase mb-4">
            {t('challenge.public.ceoRoleLabel')}
          </p>
          <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-8">
            {t('challenge.public.ceoWaiting')}
          </h2>
          <div className="space-y-4 text-gray-400 leading-relaxed text-base lg:text-lg">
            <p>{t('challenge.public.ceoStory1')}</p>
            <blockquote className="border-l-2 border-yellow-400 pl-6 my-6">
              <p className="text-white italic mb-3">
                &ldquo;{t('challenge.public.ceoStory2')}
              </p>
              <p className="text-white italic mb-4">
                {t('challenge.public.ceoStory3')}&rdquo;
              </p>
              <cite className="text-yellow-400 text-sm font-black not-italic">
                {t('challenge.public.ceoQuoteCredit')}
              </cite>
            </blockquote>
            <p className="text-white font-medium">{t('challenge.public.ceoStory4')}</p>
          </div>
          <div className="mt-10 pt-8 border-t border-gray-800">
            <p className="text-gray-500 text-sm leading-relaxed">
              {t('challenge.public.ceoPhotoCaption')}
            </p>
            <p className="text-2xl font-black text-yellow-400 mt-2">
              {t('challenge.public.ceoPhotoCaptionBold')}
            </p>
          </div>
        </div>
      </section>

      {/* ── 4. HOW TO JOIN ── */}
      <section className="border-t border-gray-900 px-6 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono tracking-[0.35em] text-orange-500 uppercase mb-4">
            {t('challenge.public.joinEyebrow')}
          </p>
          <h3 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight mb-3">
            {t('challenge.public.joinTitle')}
          </h3>
          <p className="text-xl text-yellow-400 font-bold mb-12">
            {t('challenge.public.joinHeadline')}
          </p>

          {/* Two paths */}
          <div className="grid lg:grid-cols-2 gap-6 mb-6">
            <div className="p-6 lg:p-8 bg-gray-950 border border-orange-500/30 rounded-2xl">
              <p className="text-orange-500 font-black text-lg mb-3">
                {t('challenge.public.joinShopTitle')}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.joinShopBody')}
              </p>
            </div>
            <div className="p-6 lg:p-8 bg-gray-950 border border-yellow-400/30 rounded-2xl">
              <p className="text-yellow-400 font-black text-lg mb-3">
                {t('challenge.public.joinBarberTitle')}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.joinBarberBody')}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 lg:p-8 bg-gray-950 border border-gray-800 rounded-2xl">
              <p className="text-white font-black text-lg mb-3">
                {t('challenge.public.joinCommonTitle')}
              </p>
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.joinCommonBody')}
              </p>
            </div>
            <div className="p-6 lg:p-8 bg-gray-950 border border-gray-800 rounded-2xl">
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.joinPaymentBody')}
              </p>
            </div>
            <div className="p-6 lg:p-8 bg-gray-950 border border-gray-800 rounded-2xl">
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.joinVotingBody')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── 5. CHALLENGE STEPS ── */}
      <section className="bg-gray-950 border-t border-gray-900 px-6 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono tracking-[0.35em] text-yellow-400 uppercase mb-4">
            {t('challenge.public.stepsEyebrow')}
          </p>
          <h3 className="text-4xl lg:text-5xl font-black text-white uppercase leading-tight mb-12">
            {t('challenge.public.stepsTitle')}
          </h3>

          <div className="grid lg:grid-cols-2 gap-4 mb-12">
            {([1,2,3,4,5,6] as const).map(i => (
              <div
                key={i}
                className={`p-6 rounded-2xl border bg-black ${
                  i % 2 !== 0 ? 'border-orange-500/30' : 'border-yellow-400/30'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded border-2 flex items-center justify-center text-sm font-black mb-4 ${
                    i % 2 !== 0
                      ? 'border-orange-500 text-orange-500'
                      : 'border-yellow-400 text-yellow-400'
                  }`}
                >
                  {i}
                </div>
                <h4 className="text-white font-black text-lg mb-2">
                  {(t as any)(`challenge.public.stepsStep${i}Title`)}
                </h4>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {withFees(`challenge.public.stepsStep${i}Body`)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 pt-8 space-y-4">
            {([1,2,3] as const).map(i => (
              <div key={i} className="flex items-start gap-4">
                <span className="text-yellow-400 mt-1 shrink-0 font-black">→</span>
                <p className="text-white font-medium leading-relaxed">
                  {(t as any)(`challenge.public.stepsExtra${i}`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. TIMELINE ── */}
      <section className="border-t border-gray-900 px-6 py-20 lg:py-28">
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10 lg:gap-8">
            <div>
              <p className="text-7xl font-black text-yellow-400 leading-none mb-4">3</p>
              <h4 className="text-xl font-black text-white mb-4">
                {t('challenge.public.timelineWhy3Title')}
              </h4>
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.timelineWhy3Body')}
              </p>
            </div>
            <div>
              <p className="text-7xl font-black text-yellow-400 leading-none mb-4">77</p>
              <h4 className="text-xl font-black text-white mb-4">
                {t('challenge.public.timelineWhy77Title')}
              </h4>
              <p className="text-gray-400 leading-relaxed">
                {t('challenge.public.timelineWhy77Body')}
              </p>
            </div>
            <div>
              <p className="text-4xl font-black text-yellow-400 leading-none mb-4">WIN</p>
              <h4 className="text-xl font-black text-white mb-3">
                {t('challenge.public.timelineWinTitle')}
              </h4>
              <p className="text-gray-400 leading-relaxed mb-4">
                {t('challenge.public.timelineWinBody')}
              </p>
              <ul className="space-y-2">
                {([1,2,4,5] as const).map(i => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-yellow-400 mt-1 shrink-0">—</span>
                    <span className="text-gray-300 text-sm leading-relaxed">
                      {(t as any)(`challenge.public.timelineWinList${i}`)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. LIVE ANNOUNCEMENT ── */}
      <section className="border-t border-gray-900 px-6 py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute top-5 right-5 w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono tracking-widest text-gray-500 uppercase mb-6">
            {t('challenge.public.announcementLabel')}
          </p>
          <h2 className="text-3xl lg:text-5xl font-black text-yellow-400 leading-tight mb-12">
            {t('challenge.public.announcementTagline')}
          </h2>
          <div className="grid lg:grid-cols-3 gap-4 mb-12">
            {(['Barbers','Clients','Spain'] as const).map(key => (
              <div key={key} className="p-6 bg-gray-950 rounded-2xl border border-gray-800">
                <p className="text-white leading-relaxed text-sm">
                  {(t as any)(`challenge.public.announcementFor${key}`)}
                </p>
              </div>
            ))}
          </div>
          <p className="text-xl text-white font-bold mb-12">
            {t('challenge.public.announcementConclusion')}
          </p>
          <p className="text-6xl lg:text-9xl font-black text-white tracking-tight leading-none">
            {eventDateFormatted}
          </p>
        </div>
      </section>

      {/* ── 8. CTA ── */}
      <section className="bg-yellow-400 px-6 py-24 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-black/70 font-bold text-lg mb-1">
            {t('challenge.public.ctaTagline')}
          </p>
          <p className="text-black/50 text-base mb-12">
            {t('challenge.public.ctaPrizes')}
          </p>
          <h2 className="text-5xl lg:text-7xl font-black text-black leading-tight uppercase mb-6">
            {t('challenge.public.ctaLine1')}
            <br />
            {t('challenge.public.ctaLine2')}
            <br />
            {t('challenge.public.ctaLine3')}
          </h2>
          <p className="text-2xl font-black text-black mb-2">
            {t('challenge.public.ctaQuestion')}
          </p>
          <p className="text-black/60 mb-10">
            {t('challenge.public.ctaUrgency')}
          </p>
          <div className="flex flex-col gap-3 max-w-sm mx-auto">
            <a
              href="/dashboard/barber/challenge"
              className="block w-full py-5 px-8 bg-black text-yellow-400 font-black text-lg uppercase tracking-wider rounded-xl hover:bg-gray-900 transition-colors"
            >
              {t('challenge.public.ctaBarberFinal')}
            </a>
            <a
              href="/dashboard/shop/challenge"
              className="block w-full py-5 px-8 border-2 border-black text-black font-black text-lg uppercase tracking-wider rounded-xl hover:bg-black hover:text-yellow-400 transition-colors"
            >
              {t('challenge.public.ctaShopFinal')}
            </a>
          </div>
          <p className="text-black/50 text-sm mt-10 leading-relaxed">
            {t('challenge.public.ctaMission')}
          </p>
          <p className="text-black/30 text-xs font-mono mt-4 tracking-widest">
            {t('challenge.public.ctaUrl')}
          </p>
        </div>
      </section>

    </div>
  )
}

function SubmissionGrid({
  hits,
  type,
  searching,
  appUser,
  justVotedBarber,
  justVotedShop,
  voting,
  canVote,
  onVote,
}: {
  hits: any[];
  type: 'barber' | 'shop';
  searching: boolean;
  appUser: any;
  justVotedBarber: string | null;
  justVotedShop: string | null;
  voting: string | null;
  canVote: boolean;
  onVote: (hit: any, type: 'barber' | 'shop') => void;
}) {
  const { t } = useLang();
  if (searching && hits.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-[#141414] border border-[#222] rounded-[12px] h-[280px] animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className="bg-[#111] border border-[#1e1e1e] rounded-[12px] p-8 text-center">
        <p className="text-[#666] text-sm">
          {type === 'barber'
            ? t('challenge.public.emptyBarbers')
            : t('challenge.public.emptyShops')}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {hits.map(hit => {
        const hitType: 'barber' | 'shop' = (hit.type as 'barber' | 'shop') || type;
        const alreadyVotedFromContext =
          hitType === 'barber'
            ? appUser?.challengeVotedForBarber
            : appUser?.challengeVotedForShop;
        const alreadyVotedJust =
          hitType === 'barber' ? justVotedBarber : justVotedShop;
        const userVotedForThis =
          alreadyVotedFromContext === hit.objectID ||
          alreadyVotedJust === hit.objectID;
        const userVotedForOther =
          (!!alreadyVotedFromContext && alreadyVotedFromContext !== hit.objectID) ||
          (!!alreadyVotedJust && alreadyVotedJust !== hit.objectID);

        const baseVoteCount = hit.voteCount || 0;
        const displayVoteCount =
          baseVoteCount + (alreadyVotedJust === hit.objectID ? 1 : 0);

        return (
          <div
            key={hit.objectID}
            className="bg-[#141414] border border-[#222] rounded-[12px] p-[14px] flex flex-col gap-3"
          >
            <div className="flex items-center gap-3">
              {hit.submitterAvatarUrl ? (
                <Image
                  src={hit.submitterAvatarUrl}
                  alt="Barber avatar"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full object-cover bg-[#222]"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#222] flex items-center justify-center text-[#666] text-sm font-bold">
                  {hit.submitterName?.[0]?.toUpperCase() || '?'}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="font-bold text-white truncate">
                  {hit.submitterName || t('challenge.public.unnamed')}
                </div>
                {hit.submitterCity && (
                  <div className="text-[#888] text-xs truncate">
                    {hit.submitterCity}
                  </div>
                )}
              </div>
            </div>

            {hit.photos?.[0] && (
              <div className="relative w-full aspect-square">
                <Image
                  src={hit.photos[0]}
                  alt="Submission photo"
                  fill
                  className="object-cover rounded-[10px] bg-[#0a0a0a]"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            )}

            <div className="flex items-center justify-between gap-2 mt-1">
              <div className="text-[#888] text-xs">
                {t('challenge.public.votesCount').replace('{n}', String(displayVoteCount))}
              </div>

              {userVotedForThis ? (
                <span className="text-brand-yellow text-xs font-bold">
                  {t('challenge.public.youVoted')}
                </span>
              ) : userVotedForOther ? (
                <span className="text-[#555] text-xs">{t('challenge.public.alreadyVoted')}</span>
              ) : (
                <button
                  onClick={() => onVote(hit, hitType)}
                  disabled={!canVote || voting === hit.objectID}
                  className="bg-brand-yellow text-[#0a0a0a] font-black text-xs px-3 py-1.5 rounded-lg hover:bg-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {voting === hit.objectID ? t('challenge.public.votingBtn') : t('challenge.public.voteBtn')}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

type LeaderboardItem = { id: string } & ChallengeSubmission;

function Leaderboard({
  title,
  data,
  loading,
  type,
  appUser,
  justVotedBarber,
  justVotedShop,
  voting,
  canVote,
  onVote,
}: {
  title: string;
  data: LeaderboardItem[];
  loading: boolean;
  type: 'barber' | 'shop';
  appUser: any;
  justVotedBarber: string | null;
  justVotedShop: string | null;
  voting: string | null;
  canVote: boolean;
  onVote: (hit: any, type: 'barber' | 'shop') => void;
}) {
  const { t } = useLang();
  return (
    <section className="mb-12">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl md:text-2xl font-black">{title}</h2>
        <div className="text-[#666] text-xs">
          {t('challenge.public.topN').replace('{n}', String(data.length))}
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#141414] border border-[#222] rounded-[12px] h-[280px] animate-pulse"
            />
          ))}
        </div>
      )}

      {!loading && data.length === 0 && (
        <div className="text-[#666] text-sm text-center py-12">
          {type === 'barber' ? t('challenge.public.emptyBarbers') : t('challenge.public.emptyShops')}
        </div>
      )}

      {!loading && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((sub, idx) => (
            <LeaderboardCard
              key={sub.id}
              submission={sub}
              rank={idx + 1}
              type={type}
              appUser={appUser}
              justVotedBarber={justVotedBarber}
              justVotedShop={justVotedShop}
              voting={voting}
              canVote={canVote}
              onVote={onVote}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function LeaderboardCard({
  submission,
  rank,
  type,
  appUser,
  justVotedBarber,
  justVotedShop,
  voting,
  canVote,
  onVote,
}: {
  submission: LeaderboardItem;
  rank: number;
  type: 'barber' | 'shop';
  appUser: any;
  justVotedBarber: string | null;
  justVotedShop: string | null;
  voting: string | null;
  canVote: boolean;
  onVote: (hit: any, type: 'barber' | 'shop') => void;
}) {
  const { t } = useLang();
  const alreadyVotedFromContext =
    type === 'barber'
      ? appUser?.challengeVotedForBarber
      : appUser?.challengeVotedForShop;
  const alreadyVotedJust =
    type === 'barber' ? justVotedBarber : justVotedShop;
  const userVotedForThis =
    alreadyVotedFromContext === submission.id ||
    alreadyVotedJust === submission.id;
  const userVotedForOther =
    (!!alreadyVotedFromContext && alreadyVotedFromContext !== submission.id) ||
    (!!alreadyVotedJust && alreadyVotedJust !== submission.id);

  const baseVoteCount = submission.voteCount || 0;
  const displayVoteCount =
    baseVoteCount + (alreadyVotedJust === submission.id ? 1 : 0);

  // onVote expects an Algolia-shaped hit (uses hit.objectID). Provide a shim.
  const voteShim = { ...submission, objectID: submission.id };

  return (
    <div className="relative bg-[#141414] border border-[#222] rounded-[12px] p-[14px] flex flex-col gap-3">
      <div className="absolute top-2 left-2 z-10">
        {rank === 1 && <span className="text-2xl">🥇</span>}
        {rank === 2 && <span className="text-2xl">🥈</span>}
        {rank === 3 && <span className="text-2xl">🥉</span>}
        {rank > 3 && (
          <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] text-xs font-bold px-2 py-1 rounded-md">
            #{rank}
          </span>
        )}
      </div>

      <div className="flex items-center gap-3 pl-10">
        {submission.submitterAvatarUrl ? (
          <Image
            src={submission.submitterAvatarUrl}
            alt="Barber avatar"
            width={44}
            height={44}
            className="w-11 h-11 rounded-full object-cover bg-[#222]"
          />
        ) : (
          <div className="w-11 h-11 rounded-full bg-[#222] flex items-center justify-center text-[#666] text-sm font-bold">
            {submission.submitterName?.[0]?.toUpperCase() || '?'}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="font-bold text-white truncate">
            {submission.submitterName || t('challenge.public.unnamed')}
          </div>
          {submission.submitterCity && (
            <div className="text-[#888] text-xs truncate">
              {submission.submitterCity}
            </div>
          )}
        </div>
      </div>

      {submission.photos?.[0] && (
        <div className="relative w-full aspect-square">
          <Image
            src={submission.photos[0]}
            alt="Submission photo"
            fill
            className="object-cover rounded-[10px] bg-[#0a0a0a]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
      )}

      <div className="flex items-center justify-between gap-2 mt-1">
        <div className="text-brand-orange text-sm font-bold">
          {t('challenge.public.votesCount').replace('{n}', String(displayVoteCount))}
        </div>

        {userVotedForThis ? (
          <span className="text-brand-yellow text-xs font-bold">
            {t('challenge.public.youVoted')}
          </span>
        ) : userVotedForOther ? (
          <span className="text-[#555] text-xs">{t('challenge.public.alreadyVoted')}</span>
        ) : (
          <button
            onClick={() => onVote(voteShim, type)}
            disabled={!canVote || voting === submission.id}
            className="bg-brand-yellow text-[#0a0a0a] font-black text-xs px-3 py-1.5 rounded-lg hover:bg-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {voting === submission.id ? t('challenge.public.votingBtn') : t('challenge.public.voteBtn')}
          </button>
        )}
      </div>
    </div>
  );
}
