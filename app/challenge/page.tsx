'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { sendEmailVerification } from 'firebase/auth';
import { algoliasearch } from 'algoliasearch';
import { db, auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';
import { useDebounce } from '@/hooks/useDebounce';
import { toast } from '@/lib/toast';
import CountdownTimer from '@/components/CountdownTimer';
import type { ChallengeSettings } from '@/lib/types';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

export default function ChallengePage() {
  const { user, appUser } = useAuth();

  const [settings, setSettings] = useState<ChallengeSettings | null>(null);
  const [loading, setLoading] = useState(true);

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

  // Settings fetch (once)
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

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText('https://titezme.com/challenge');
    toast.success('Link copied — share it with your network!');
  }, []);

  const handleResendVerification = useCallback(async () => {
    if (!auth.currentUser) return;
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Verification email sent. Check your inbox.');
    } catch {
      toast.error('Could not send verification email. Try again in a moment.');
    }
  }, []);

  const handleVerifyRefresh = useCallback(async () => {
    if (!auth.currentUser) return;
    setVerifyingEmail(true);
    try {
      await auth.currentUser.reload();
      await auth.currentUser.getIdToken(true);
      setVerifiedTick(t => t + 1);
      if (auth.currentUser?.emailVerified) {
        toast.success('Email verified. You can vote now.');
      } else {
        toast.error('Still not verified. Click the link in your email first.');
      }
    } catch {
      toast.error('Could not refresh. Please try again.');
    } finally {
      setVerifyingEmail(false);
    }
  }, []);

  async function handleVote(hit: any, type: 'barber' | 'shop') {
    if (!user) {
      toast.error('Please sign in to vote.');
      return;
    }
    const verifiedNow = auth.currentUser?.emailVerified ?? user.emailVerified;
    if (!verifiedNow) {
      toast.error('Please verify your email first.');
      return;
    }
    if (phase !== 'voting') {
      toast.error('Voting is not open.');
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
      toast.success('Vote recorded! Thanks for participating.');
    } catch (e: any) {
      if (e?.code === 'permission-denied') {
        toast.error('Voting is closed or you have already voted.');
      } else {
        toast.error('Failed to vote. Please try again.');
      }
    } finally {
      setVoting(null);
    }
  }

  // ─── Render branches ─────────────────────────────────────────────────────

  if (loading || phase === 'loading') {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-[#666] text-sm">
        Loading…
      </div>
    );
  }

  if (phase === 'misconfigured') {
    return (
      <SimpleMessage
        title="Challenge coming soon"
        body="The challenge is being configured. Come back soon."
      />
    );
  }

  if (phase === 'preOpen' || phase === 'entry' || phase === 'gap') {
    const isGap = phase === 'gap';
    return (
      <PreVotingScreen
        settings={settings!}
        headline={isGap ? 'Submissions are closed' : 'The challenge is live'}
        subhead={
          isGap
            ? 'Voting begins in'
            : 'Voting opens in'
        }
        onShare={handleShare}
      />
    );
  }

  if (phase === 'closed') {
    return (
      <SimpleMessage
        title="Voting has closed"
        body="Winners will be announced at the public event on September 17, 2026."
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
            🏆 Challenge 2026
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-3">
            Vote for your favorite
          </h1>
          <p className="text-[#888] text-sm md:text-base">
            Voting closes in{' '}
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
            Share the Challenge
          </button>
        </div>

        {/* Auth / verify gate */}
        {!user ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-[16px] p-6 mb-8">
            <h2 className="text-lg font-black mb-2">Sign up to vote in the Challenge</h2>
            <p className="text-[#888] text-sm mb-4">
              Voting is free but you need an account to participate.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-brand-yellow text-[#0a0a0a] font-black text-sm px-5 py-3 rounded-xl hover:bg-brand-yellow/90 transition-colors"
            >
              Sign up to vote
            </Link>
          </div>
        ) : !emailVerifiedNow ? (
          <div className="bg-[#111] border border-[#1e1e1e] rounded-[16px] p-6 mb-8">
            <h2 className="text-lg font-black mb-2">Verify your email to vote</h2>
            <p className="text-[#888] text-sm mb-4">
              We sent a verification link to{' '}
              <span className="text-white font-bold">{user.email}</span>. Click it,
              then come back.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleResendVerification}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold text-sm px-4 py-2.5 rounded-xl hover:border-[#444] transition-colors"
              >
                Resend verification email
              </button>
              <button
                onClick={handleVerifyRefresh}
                disabled={verifyingEmail}
                className="bg-brand-yellow text-[#0a0a0a] font-black text-sm px-4 py-2.5 rounded-xl hover:bg-brand-yellow/90 disabled:opacity-50"
              >
                {verifyingEmail ? 'Checking…' : "I've verified my email — refresh"}
              </button>
            </div>
          </div>
        ) : (
          // Signed in + verified → search bar
          <div className="mb-8">
            <input
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
              placeholder="Search by name…"
              className="w-full sm:max-w-md bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]"
            />
            <div className="text-xs text-[#666] mt-2">
              Showing {barberHits.length} barbers · {shopHits.length} barbershops
            </div>
          </div>
        )}

        {/* Section: Barbers */}
        <section className="mb-12">
          <h2 className="text-xl font-black mb-4">
            🪒 Barbers ({barberHits.length})
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
            💈 Barbershops ({shopHits.length})
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
      </div>
    </div>
  );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function SimpleMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6 py-20">
      <div className="max-w-[640px] text-center">
        <div className="inline-block text-[10px] font-black tracking-[3px] text-brand-orange uppercase mb-4">
          🏆 Challenge 2026
        </div>
        <h1 className="text-3xl md:text-4xl font-black mb-4">{title}</h1>
        <p className="text-[#888] text-sm mb-8">{body}</p>
        <Link
          href="/"
          className="inline-block bg-brand-yellow text-[#0a0a0a] font-black text-sm px-6 py-3 rounded-xl"
        >
          Back to home
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
  const openDate = settings.votingOpenAt
    ? new Date(settings.votingOpenAt).toLocaleDateString('en-US', {
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
            🏆 Challenge 2026
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
            <p className="text-[#666] text-xs">Voting opens {openDate}.</p>
          )}
        </div>

        <div className="bg-[#111] border-2 border-brand-orange/40 rounded-[16px] p-6 mb-6">
          <div className="mb-4">
            <div className="text-brand-yellow text-3xl md:text-4xl font-black leading-none">
              Win {shopAmount}
            </div>
            <div className="text-[#888] text-[11px] uppercase tracking-widest mt-1">
              For barbershops
            </div>
          </div>
          <div>
            <div className="text-brand-yellow text-2xl md:text-3xl font-black leading-none">
              Win {barberAmount}
            </div>
            <div className="text-[#888] text-[11px] uppercase tracking-widest mt-1">
              For barbers
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={onShare}
            className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold text-xs px-4 py-2.5 rounded-full hover:border-[#444] transition-colors"
          >
            Share the Challenge
          </button>
          <Link
            href="/"
            className="bg-brand-yellow text-[#0a0a0a] font-black text-xs px-5 py-2.5 rounded-full"
          >
            Back to home
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
            ? 'No barber submissions yet.'
            : 'No barbershop submissions yet.'}
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
                  {hit.submitterName || 'Unnamed'}
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
              <div className="text-[#888] text-xs">{displayVoteCount} votes</div>

              {userVotedForThis ? (
                <span className="text-brand-yellow text-xs font-bold">
                  ✓ You voted
                </span>
              ) : userVotedForOther ? (
                <span className="text-[#555] text-xs">Already voted</span>
              ) : (
                <button
                  onClick={() => onVote(hit, hitType)}
                  disabled={!canVote || voting === hit.objectID}
                  className="bg-brand-yellow text-[#0a0a0a] font-black text-xs px-3 py-1.5 rounded-lg hover:bg-brand-yellow/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {voting === hit.objectID ? 'Voting…' : 'Vote'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
