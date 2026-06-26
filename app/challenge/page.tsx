'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
    const isGap = phase === 'gap';
    return (
      <PreVotingScreen
        settings={settings!}
        headline={isGap ? t('challenge.public.gapTitle') : t('challenge.public.preTitle')}
        subhead={
          isGap
            ? t('challenge.public.votingBeginsIn')
            : t('challenge.public.votingOpensIn')
        }
        onShare={handleShare}
      />
    );
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

function PreVotingScreen({
  settings,
  headline,
  subhead,
  onShare,
}: {
  settings: ChallengeSettings;
  headline: string;
  subhead: string;
  onShare: () => void;
}) {
  const { t } = useLang();
  const openDate = settings.votingOpenAt
    ? new Date(settings.votingOpenAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';
  const shopAmount = `€${(settings.prizeShopValue ?? 100000).toLocaleString('es-ES')}`;
  const barberAmount = `€${(settings.prizeBarberValue ?? 12000).toLocaleString('es-ES')}`;

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-[640px] w-full">
        <div className="text-center mb-8">
          <div className="inline-block text-[10px] font-black tracking-[3px] text-brand-orange uppercase mb-4">
            🏆 {t('challenge.public.eyebrow')}
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-4">{headline}</h1>
          <p className="text-[#888] text-sm mb-2">
            {subhead}{' '}
            <CountdownTimer
              targetMs={settings.votingOpenAt}
              className="text-brand-yellow font-bold"
            />
          </p>
          {openDate && (
            <p className="text-[#666] text-xs">
              {t('challenge.public.votingOpensOn').replace('{date}', openDate)}
            </p>
          )}
        </div>

        <div className="bg-[#111] border-2 border-brand-orange/40 rounded-[16px] p-6 mb-6">
          <div className="mb-4">
            <div className="text-brand-yellow text-3xl md:text-4xl font-black leading-none">
              {t('landing.challenge.win')} {shopAmount}
            </div>
            <div className="text-[#888] text-[11px] uppercase tracking-widest mt-1">
              {t('landing.challenge.forBarbershops')}
            </div>
          </div>
          <div>
            <div className="text-brand-yellow text-2xl md:text-3xl font-black leading-none">
              {t('landing.challenge.win')} {barberAmount}
            </div>
            <div className="text-[#888] text-[11px] uppercase tracking-widest mt-1">
              {t('landing.challenge.forBarbers')}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onShare}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold text-xs px-4 py-2.5 rounded-full hover:border-[#444] transition-colors"
          >
            {t('challenge.public.shareBtn')}
          </button>
          <Link
            href="/"
            className="bg-brand-yellow text-[#0a0a0a] font-black text-xs px-5 py-2.5 rounded-full"
          >
            {t('challenge.public.backHome')}
          </Link>
        </div>
      </div>
    </div>
  );
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
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={hit.submitterAvatarUrl}
                  alt=""
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
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={hit.photos[0]}
                alt=""
                className="w-full aspect-square object-cover rounded-[10px] bg-[#0a0a0a]"
              />
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
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={submission.submitterAvatarUrl}
            alt=""
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
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={submission.photos[0]}
          alt=""
          className="w-full aspect-square object-cover rounded-[10px] bg-[#0a0a0a]"
        />
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
