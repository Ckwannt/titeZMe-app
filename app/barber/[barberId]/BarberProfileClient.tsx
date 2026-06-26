'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  collection, query, where, doc, getDoc,
  orderBy, limit, updateDoc, arrayUnion, arrayRemove, onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BarberProfileSkeleton } from '@/components/skeletons';
import { toast } from '@/lib/toast';
import { getOpenStatus, getLocalDateString, getTimezoneFromLocation, getScheduleDocId } from '@/lib/schedule-utils';
import { useLang } from '@/lib/i18n/LangContext';
import { useChallengeConfig } from '@/hooks/useChallengeConfig';
import SuspendedBookingBanner from '@/components/SuspendedBookingBanner';

// ─── types ────────────────────────────────────────────────────────────────────

type BarberDoc = {
  id: string;
  userId?: string;
  bio?: string;
  vibes?: string[];
  specialties?: string[];
  clientele?: string[];
  languages?: string[];
  isSolo?: boolean;
  shopId?: string | null;
  rating?: number;
  reviewCount?: number;
  totalCuts?: number;
  photos?: string[];
  videos?: string[];
  profilePhotoUrl?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  isLive?: boolean;
  isOnboarded?: boolean;
  currency?: string;
  titeZMeCut?: { durationMinutes: number; price: number; currency?: string };
  barberCode?: string;
  ownsShop?: boolean;
  avgResponseMinutes?: number;
  city?: string;
  experienceStartYear?: number;
  experienceVerified?: boolean;
  isFake?: boolean;
};

type UserDoc = {
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  city?: string;
  country?: string;
  createdAt?: number;
};

type ShopDoc = {
  id: string;
  name?: string;
  address?: { street?: string; number?: string; city?: string; country?: string };
  googleMapsUrl?: string;
};

type ServiceDoc = {
  id: string;
  name?: string;
  price?: number;
  durationMinutes?: number;
  duration?: number;
  isActive?: boolean;
};

type ReviewDoc = {
  id: string;
  clientId?: string;
  providerId?: string;
  rating?: number;
  comment?: string;
  createdAt?: number;
  user?: { firstName?: string; lastName?: string };
};

// ─── helpers ──────────────────────────────────────────────────────────────────

function formatTimeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  return weeks < 4 ? `${weeks}w ago` : new Date(ts).toLocaleDateString();
}

function formatMemberSince(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

const POSITIVE_WORDS = new Set([
  'clean', 'perfect', 'best', 'amazing', 'love', 'great',
  'excellent', 'recommend', 'incredible', 'fantastic',
]);

function HighlightedText({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <>
      {words.map((word, i) => {
        const lower = word.toLowerCase().replace(/[^a-z]/g, '');
        return POSITIVE_WORDS.has(lower)
          ? <span key={i} className="text-brand-yellow font-bold"> {word}</span>
          : <span key={i}> {word}</span>;
      })}
    </>
  );
}

// getOpenStatus imported from @/lib/schedule-utils

// ─── component ────────────────────────────────────────────────────────────────

export interface BarberProfileInitialData {
  profile: BarberDoc;
  userProfile: UserDoc;
  shop: ShopDoc | null;
  services: ServiceDoc[];
  reviews: ReviewDoc[];
  schedule?: { availableSlots?: Record<string, string[]> } | null;
}

interface BarberProfileClientProps {
  barberId: string;
  initialData?: BarberProfileInitialData;
}

export default function BarberProfileClient({ barberId, initialData }: BarberProfileClientProps) {
  const { user, appUser } = useAuth();
  const router = useRouter();
  const { data: challengeConfig } = useChallengeConfig();
  const isChallengeModeOn = challengeConfig?.challengeMode ?? false;
  const challengeModeEndDate = challengeConfig?.challengeModeEndDate ?? '';
  const queryClient = useQueryClient();

  const { t } = useLang();
  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [showFakeModal, setShowFakeModal] = useState(false);
  const [bookingContext, setBookingContext] = useState<'solo' | 'shop'>('solo');
  const [visibleReviews, setVisibleReviews] = useState(5);
  // Pre-populate schedule from SSR initialData so the sidebar shows availability immediately
  const [schedule, setSchedule] = useState<{ availableSlots?: Record<string, string[]> } | null>(
    initialData?.schedule ?? null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const [optimisticFav, setOptimisticFav] = useState<boolean | null>(null);
  // Real-time services + reviews — updated via onSnapshot so edits appear instantly
  const [services, setServices] = useState<ServiceDoc[]>(initialData?.services || []);
  const [reviews, setReviews] = useState<ReviewDoc[]>(initialData?.reviews || []);
  const reviewUserCache = useRef<Record<string, ReviewDoc['user']>>({});

  // ─── queries ─────────────────────────────────────────────────────────────────

  const serverInitialProfile = initialData
    ? { profile: initialData.profile, userProfile: initialData.userProfile, shop: initialData.shop }
    : undefined;

  const { data, isLoading } = useQuery({
    queryKey: ['barberPublicProfile', barberId],
    queryFn: async () => {
      const pSnap = await getDoc(doc(db, 'barberProfiles', barberId));
      if (!pSnap.exists()) return null;
      const profile = { id: pSnap.id, ...pSnap.data() } as BarberDoc;
      const userProfile = (pSnap.data() ?? {}) as UserDoc;
      let shop: ShopDoc | null = null;
      if (profile.shopId) {
        const shopSnap = await getDoc(doc(db, 'barbershops', profile.shopId));
        if (shopSnap.exists()) shop = { id: shopSnap.id, ...shopSnap.data() } as ShopDoc;
      }
      return { profile, userProfile, shop };
    },
    initialData: serverInitialProfile,
    // staleTime uses global default (30 s) — explicit value removed
  });

  // ─── real-time schedule ──────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'schedules', getScheduleDocId(barberId)),
      snap => {
        if (snap.exists()) setSchedule(snap.data() as { availableSlots?: Record<string, string[]> });
      },
    );
    return () => unsub();
  }, [barberId]);

  // ─── real-time services ───────────────────────────────────────────────────────
  // Subscribes to the correct provider (solo barber vs shop) based on bookingContext.
  // When barber adds / edits / removes a service the public profile updates instantly.

  useEffect(() => {
    const providerId =
      bookingContext === 'shop' && data?.profile?.shopId ? data.profile.shopId : barberId;
    const providerType = bookingContext === 'shop' ? 'shop' : 'barber';
    const q = query(
      collection(db, 'services'),
      where('providerId', '==', providerId),
      where('providerType', '==', providerType),
      where('isActive', '==', true),
      orderBy('price', 'asc'),
    );
    const unsub = onSnapshot(q, (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceDoc)));
    });
    return () => unsub();
  }, [barberId, bookingContext, data?.profile?.shopId]);

  // ─── real-time reviews ────────────────────────────────────────────────────────
  // New reviews appear on the public profile the moment a client submits them.
  // User names are fetched once per unique clientId and cached in reviewUserCache.

  useEffect(() => {
    const q = query(
      collection(db, 'reviews'),
      where('providerId', '==', barberId),
      orderBy('createdAt', 'desc'),
      limit(20),
    );
    const unsub = onSnapshot(q, async (snap) => {
      const raw: ReviewDoc[] = snap.docs.map(d => ({ id: d.id, ...d.data() } as ReviewDoc));
      // Fetch names only for clientIds not yet in our local cache
      const missing = raw.filter(r => r.clientId && !reviewUserCache.current[r.clientId]);
      if (missing.length > 0) {
        await Promise.all(
          missing.map(async r => {
            try {
              const uSnap = await getDoc(doc(db, 'users', r.clientId!));
              if (uSnap.exists())
                reviewUserCache.current[r.clientId!] = uSnap.data() as ReviewDoc['user'];
            } catch { /* non-critical */ }
          })
        );
      }
      setReviews(
        raw.map(r => ({ ...r, user: r.clientId ? reviewUserCache.current[r.clientId] : undefined }))
      );
    });
    return () => unsub();
  }, [barberId]);

  useEffect(() => {
    if (data?.profile) setBookingContext(data.profile.isSolo ? 'solo' : 'shop');
  }, [data?.profile?.isSolo]);

  // ─── derived ─────────────────────────────────────────────────────────────────

  const profile = data?.profile;
  const userProfile = data?.userProfile;
  const shop = data?.shop;
  const openStatus = getOpenStatus(
    schedule?.availableSlots,
    userProfile?.city,
    userProfile?.country,
    barberId
  );
  const todayDate = getLocalDateString(
    getTimezoneFromLocation(userProfile?.city, userProfile?.country)
  );
  const currentYear = new Date().getFullYear();
  const yearsExperience = profile?.experienceStartYear
    ? currentYear - profile.experienceStartYear
    : null;
  const estimatedTotalCuts = profile?.experienceStartYear && yearsExperience !== null
    ? (yearsExperience * 240 * 10) + (profile.totalCuts || 0)
    : (profile?.totalCuts || 0);
  const cutsLabel = estimatedTotalCuts.toLocaleString();
  const minPrice = services.length > 0 ? Math.min(...services.map(s => s.price || 0)) : null;
  const currency = profile?.currency || '€';
  const isFav = optimisticFav !== null ? optimisticFav : !!(appUser?.favoriteBarbers?.includes(barberId));
  const firstName = userProfile?.firstName || 'Barber';
  const lastName = userProfile?.lastName || '';
  const todaySlots: string[] = schedule?.availableSlots?.[todayDate] || [];

  const ratingBreakdown = [5, 4, 3, 2, 1].map(star => ({
    star,
    pct: reviews.length > 0
      ? (reviews.filter(r => Math.round(r.rating || 0) === star).length / reviews.length) * 100
      : 0,
  }));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return {
      dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
      hasSlots: (schedule?.availableSlots?.[dateStr] || []).length > 0,
    };
  });

  // ─── actions ─────────────────────────────────────────────────────────────────

  const handleBooking = (serviceId?: string) => {
    if (isChallengeModeOn) return;
    if (profile?.isFake) { setShowFakeModal(true); return; }
    if (!user) { router.push(`/login?redirect=/barber/${barberId}`); return; }
    if (!appUser?.role) { toast.error(t('profile.pleaseLogin')); return; }
    if (appUser?.role === 'admin') { toast.error(t('profile.adminCannotBook')); return; }
    if (appUser?.uid === barberId) { toast.error(t('profile.cannotBookSelf')); return; }
    if (!appUser?.isOnboarded) {
      router.push(appUser?.role === 'barber' ? '/onboarding/barber' : '/onboarding/client');
      return;
    }
    if (!profile?.isLive) { toast.error(t('profile.notAcceptingBookings')); return; }
    const qs = new URLSearchParams({ context: bookingContext });
    if (serviceId) qs.set('serviceId', serviceId);
    router.push(`/book/${barberId}?${qs.toString()}`);
  };

  const handleToggleFav = async () => {
    if (!user) { router.push('/login'); return; }
    if (appUser?.role === 'admin') { toast.error(t('profile.adminCannotSave')); return; }
    // Optimistic update — flip immediately
    const wasAlreadyFav = isFav;
    setOptimisticFav(!wasAlreadyFav);
    setIsSaving(true);
    try {
      if (wasAlreadyFav) {
        await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayRemove(barberId) });
        toast.success(t('profile.removedFromSaved'));
      } else {
        await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayUnion(barberId) });
        toast.success(t('profile.savedConfirm'));
      }
      queryClient.invalidateQueries({ queryKey: ['clientData', user.uid] });
    } catch (e) {
      // Revert on failure
      setOptimisticFav(wasAlreadyFav);
      toast.error(t('profile.failedToUpdate'));
      console.error(e);
    }
    setIsSaving(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success(t('profile.linkCopiedToast'));
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── guard states ─────────────────────────────────────────────────────────────

  if (isLoading) return <BarberProfileSkeleton />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💈</div>
          <h1 className="text-2xl font-black mb-2">{t('profile.barberNotFound')}</h1>
          <p className="text-[#888] mb-6">{t('profile.profileDoesntExist')}</p>
          <Link href="/barbers" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full">{t('profile.findBarbers')}</Link>
        </div>
      </div>
    );
  }


  // ─── render ───────────────────────────────────────────────────────────────────

  return (
    <>
      {lightboxPhoto && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setLightboxPhoto(null)}>
          <button className="absolute top-4 right-4 text-white text-3xl font-black z-10">✕</button>
          <div className="relative w-full max-w-[80vw] max-h-[80vh] aspect-square">
            <Image src={lightboxPhoto} alt="Portfolio" fill className="object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}

      {showFakeModal && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setShowFakeModal(false)}
        >
          <div
            className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-6 max-w-[420px] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-lg font-black text-white mb-2">
              Este barbero está completo por ahora
            </h2>
            <p className="text-sm text-[#888] font-medium leading-relaxed mb-5">
              Actualmente no tiene huecos disponibles. Explora otros barberos en la plataforma.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => router.push('/barbers')}
                className="w-full bg-brand-yellow text-[#0a0a0a] font-black py-3 rounded-full text-sm hover:opacity-90 transition-opacity"
              >
                Ver otros barberos
              </button>
              <button
                onClick={() => setShowFakeModal(false)}
                className="w-full border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444] font-black py-3 rounded-full text-sm transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-[#0a0a0a] min-h-screen text-white pb-24 lg:pb-0">
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <div className="text-xs font-bold text-[#444]">
            <Link href="/" className="hover:text-white transition-colors">{t('nav.home')}</Link>
            <span className="mx-2">›</span>
            <Link href="/barbers" className="hover:text-white transition-colors">{t('nav.barbers')}</Link>
            <span className="mx-2">›</span>
            <span className="text-[#888]">{firstName} {lastName}</span>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-8 flex gap-8 items-start">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* SECTION 1 — Header */}
            <div className="flex gap-5 items-start mb-8">
              <div className="relative w-20 h-20 rounded-[18px] overflow-hidden shrink-0 border border-[#2a2a2a] bg-[#1a1a1a]">
                {(profile.profilePhotoUrl || userProfile?.photoUrl) ? (
                  <Image
                    src={(profile.profilePhotoUrl || userProfile?.photoUrl) as string}
                    alt={firstName} fill className="object-cover" referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-[#0a0a0a] bg-gradient-to-br from-brand-orange to-brand-yellow">
                    {firstName[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <h1 className="text-[22px] font-black leading-tight">{firstName} {lastName}</h1>
                    <div className={`text-sm font-bold mt-1 ${openStatus.color}`}>{openStatus.label}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {profile.instagram && (
                      <a href={`https://instagram.com/${profile.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#E1306C] transition-colors text-lg" title="Instagram">📸</a>
                    )}
                    {profile.tiktok && (
                      <a href={`https://tiktok.com/@${profile.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-white transition-colors text-lg" title="TikTok">🎵</a>
                    )}
                    {profile.facebook && (
                      <a href={`https://facebook.com/${profile.facebook}`} target="_blank" rel="noopener noreferrer" className="text-[#666] hover:text-[#1877F2] transition-colors text-lg" title="Facebook">👤</a>
                    )}
                  </div>
                </div>

                <div className="text-sm font-bold text-[#888] mt-1.5 flex flex-wrap items-center gap-1.5">
                  {shop ? (
                    <>
                      <span>📍 {[shop.address?.street, shop.address?.number].filter(Boolean).join(' ')}{shop.address?.city ? `, ${shop.address.city}` : ''}</span>
                      {shop.googleMapsUrl && (
                        <a href={shop.googleMapsUrl} target="_blank" rel="noopener noreferrer" className="text-brand-yellow hover:underline text-xs">Get directions</a>
                      )}
                      <Link href={`/shop/${profile.shopId}`} className="text-[#666] hover:text-white text-xs transition-colors">· 🏪 {shop.name}</Link>
                    </>
                  ) : (
                    <span>📍 {userProfile?.city}{userProfile?.country ? `, ${userProfile.country}` : ''}</span>
                  )}
                </div>
                {shop && profile.isSolo && <div className="text-xs text-[#555] mt-0.5">{t('profile.alsoSoloBookings')}</div>}

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-bold">
                  {(profile.reviewCount || 0) > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-brand-yellow">★</span>
                      <span>{typeof profile.rating === 'number' ? profile.rating.toFixed(1) : '—'}</span>
                      <span className="text-[#666]">({profile.reviewCount} {t('profile.reviewsCount')})</span>
                    </div>
                  ) : <span className="text-[#888]">{t('profile.newBarber')}</span>}
                  {userProfile?.createdAt && (
                    <span className="text-[#555] text-xs">· Member since {formatMemberSince(userProfile.createdAt)}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="text-[#aaa] text-[15px] font-medium leading-relaxed bg-[#111] p-5 rounded-[20px] border border-[#222] mb-8">
                {profile.bio}
              </p>
            )}

            {/* SECTION 2 — Languages / Vibe / Works with */}
            {((profile.languages?.length || 0) > 0 || (profile.vibes?.length || 0) > 0 || (profile.clientele?.length || 0) > 0) && (
              <div className="flex flex-wrap gap-3 mb-6">
                {(profile.languages?.length || 0) > 0 && (
                  <div className="bg-[#0d1117] border border-[#1a2a3a] rounded-2xl p-4 flex-1 min-w-[130px]">
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">{t('misc.languages')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.languages!.map((l: string) => <span key={l} className="bg-blue-950/60 text-blue-300 px-2 py-0.5 rounded-md text-[11px] font-bold border border-blue-900/50">{l}</span>)}
                    </div>
                  </div>
                )}
                {(profile.vibes?.length || 0) > 0 && (
                  <div className="bg-[#110d17] border border-[#2a1a3a] rounded-2xl p-4 flex-1 min-w-[130px]">
                    <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-2">✨ Vibe</div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.vibes!.map((v: string) => <span key={v} className="bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded-md text-[11px] font-bold border border-purple-900/50">{v}</span>)}
                    </div>
                  </div>
                )}
                {(profile.clientele?.length || 0) > 0 && (
                  <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 flex-1 min-w-[130px]">
                    <div className="text-[10px] font-black text-[#888] uppercase tracking-widest mb-2">👥 {t('profile.worksWith')}</div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.clientele!.map((c: string) => <span key={c} className="bg-[#1a1a1a] text-[#ccc] px-2 py-0.5 rounded-md text-[11px] font-bold border border-[#333]">{c}</span>)}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Specialties */}
            {(profile.specialties?.length || 0) > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <span className="text-[10px] font-black text-[#555] uppercase tracking-widest">✂️ Specialties</span>
                {profile.specialties!.map((s: string) => (
                  <span key={s} className="bg-brand-yellow/10 text-brand-yellow px-3 py-1 rounded-full text-[11px] font-black border border-brand-yellow/20">{s}</span>
                ))}
              </div>
            )}

            {/* SECTION 3 — Portfolio */}
            {(profile.photos?.length || 0) > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase">{t('profile.theirWork')}</h3>
                  <span className="text-xs font-bold text-[#555]">{t('profile.seeAll').replace('{n}', String(profile.photos!.length))}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {profile.photos!.slice(0, 8).map((photo: string, i: number) => (
                    <button key={i} onClick={() => setLightboxPhoto(photo)}
                      className="aspect-square rounded-[10px] overflow-hidden relative border border-[#2a2a2a] hover:border-brand-yellow transition-colors"
                    >
                      <Image src={photo} alt={`Work ${i + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECTION 4 — Reviews */}
            <div className="mb-10">
              <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-5">{t('profile.whatClientsSay')}</h3>
              {reviews.length > 0 ? (
                <>
                  <div className="flex items-start gap-6 mb-6 bg-[#111] border border-[#222] rounded-2xl p-5">
                    <div className="text-center shrink-0">
                      <div className="text-5xl font-black text-brand-yellow leading-none">
                        {typeof profile.rating === 'number' ? profile.rating.toFixed(1) : '—'}
                      </div>
                      <div className="text-brand-yellow text-sm mt-1">{'★'.repeat(Math.round(profile.rating || 0))}</div>
                      <div className="text-[11px] text-[#555] mt-1">{profile.reviewCount} {t('profile.reviewsCount')}</div>
                    </div>
                    <div className="flex-1">
                      {ratingBreakdown.map(({ star, pct }) => (
                        <div key={star} className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] text-[#555] w-4">{star}★</span>
                          <div className="flex-1 h-1.5 bg-[#222] rounded-full overflow-hidden">
                            <div className="h-full bg-brand-yellow rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] text-[#555] w-8 text-right">{Math.round(pct)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    {reviews.slice(0, visibleReviews).map((r: ReviewDoc) => (
                      <div key={r.id} className="bg-[#111] border border-[#222] rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center text-[11px] font-black text-[#0a0a0a] shrink-0">
                              {r.user?.firstName?.[0] || 'C'}{r.user?.lastName?.[0] || ''}
                            </div>
                            <div>
                              <div className="text-sm font-bold">{r.user?.firstName || 'Client'} {r.user?.lastName?.[0] || ''}.</div>
                              <div className="text-[10px] text-[#555]">{r.createdAt ? formatTimeAgo(r.createdAt) : ''}</div>
                            </div>
                          </div>
                          <div className="text-brand-yellow text-sm font-black">{'★'.repeat(r.rating || 0)}</div>
                        </div>
                        <p className="text-[#999] text-[13px] leading-relaxed italic">
                          &quot;<HighlightedText text={r.comment || ''} />&quot;
                        </p>
                      </div>
                    ))}
                  </div>

                  {reviews.length > visibleReviews && (
                    <button onClick={() => setVisibleReviews(v => v + 5)}
                      className="w-full mt-4 py-3 border border-[#2a2a2a] rounded-2xl text-[#888] text-sm font-bold hover:text-white hover:border-[#444] transition-colors"
                    >
                      {t('profile.loadMoreReviews')}
                    </button>
                  )}
                </>
              ) : (
                <div className="border border-[#2a2a2a] bg-[#111] rounded-2xl p-8 text-center">
                  <div className="text-[#555] text-sm font-bold">{t('profile.noReviewsYet')}</div>
                  <div className="text-[#444] text-xs mt-1">{t('profile.noReviewsYetBookFirst').replace('{name}', firstName)}</div>
                </div>
              )}
            </div>

            {/* SECTION 5 — Services */}
            <div>
              <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-4">{t('profile.servicesAndPrices')}</h3>

              {profile.isSolo && profile.shopId && shop && (
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setBookingContext('solo')}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${bookingContext === 'solo' ? 'bg-brand-yellow text-[#0a0a0a] border-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:text-white'}`}
                  >
                    👤 {t('profile.bookDirectly').replace('{name}', firstName)}
                  </button>
                  <button onClick={() => setBookingContext('shop')}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${bookingContext === 'shop' ? 'bg-brand-yellow text-[#0a0a0a] border-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:text-white'}`}
                  >
                    🏪 Via {shop.name}
                  </button>
                </div>
              )}

              <div className="flex flex-col gap-3">
                {profile.titeZMeCut && (
                  <div className="bg-[#111] border border-[#2a2a2a] border-l-[3px] border-l-brand-yellow rounded-2xl p-4 flex justify-between items-center gap-3">
                    <div className="flex-1">
                      <div className="font-black text-sm flex items-center gap-1.5">{t('profile.titeZMeCutLabel')} <span className="text-[#555] text-xs">🔒</span></div>
                      <div className="text-[11px] text-[#666] mt-0.5">{t('profile.titeZMeCutDescBarber').replace('{name}', firstName)}</div>
                      <div className="text-[11px] text-[#444] mt-0.5">⏱ {profile.titeZMeCut.durationMinutes} {t('misc.minShort')}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="font-black text-brand-yellow">{currency}{profile.titeZMeCut.price}</div>
                      {isChallengeModeOn ? null : <button onClick={() => handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined} className={`px-4 py-2 rounded-xl text-xs font-black transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`}>{t('profile.book')}</button>}
                    </div>
                  </div>
                )}
                {isChallengeModeOn && (
                  <SuspendedBookingBanner endDate={challengeModeEndDate} />
                )}

                {services.length === 0 && !profile.titeZMeCut && (
                  <div className="text-sm font-bold text-[#555] border-2 border-dashed border-[#2a2a2a] rounded-2xl p-6 text-center">{t('profile.noServicesListed')}</div>
                )}

                {services.map((s: ServiceDoc) => (
                  <div key={s.id} className="group bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 flex justify-between items-center hover:border-[#444] transition-colors">
                    <div className="flex-1">
                      <div className="font-black text-white text-sm">{s.name}</div>
                      <div className="text-[11px] text-[#555] mt-0.5">⏱ {s.durationMinutes || s.duration} {t('misc.minShort')}</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="font-black text-brand-yellow">{currency}{s.price}</div>
                      {isChallengeModeOn ? null : <button onClick={() => handleBooking(s.id)} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${!profile.isLive ? 'bg-[#1a1a1a] text-[#555] border border-[#2a2a2a] cursor-not-allowed' : 'bg-[#1a1a1a] text-white border border-[#333] group-hover:bg-brand-yellow group-hover:text-[#0a0a0a] group-hover:border-brand-yellow'}`}
                      >
                        {t('profile.book')}
                      </button>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────────────── */}
          <div className="hidden lg:flex w-[340px] shrink-0 flex-col gap-4 sticky top-[80px]">

            {/* CARD 1 — Booking */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1">{t('profile.startingFrom')}</div>
              <div className="text-3xl font-black text-brand-yellow mb-4">
                {minPrice !== null ? `${currency}${minPrice}` : t('profile.pricesOnRequest')}
              </div>
              {isChallengeModeOn ? null : <button onClick={() => handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? t('profile.notAcceptingBookings') : undefined}
                className={`w-full font-black py-3 rounded-full mb-2 text-sm transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`}
              >
                {t('buttons.bookNow')}
              </button>}
              <button onClick={handleToggleFav} disabled={isSaving}
                className={`w-full py-3 rounded-full font-black text-sm mb-2 border transition-colors ${isFav ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:border-white hover:text-white'}`}
              >
                {isFav ? t('profile.saved') : t('profile.saveBarber')}
              </button>
              <button onClick={handleShare}
                className="w-full py-3 rounded-full font-black text-sm border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444] transition-colors"
              >
                {copied ? t('profile.linkCopied') : t('profile.shareProfile')}
              </button>
              <div className="mt-4 pt-4 border-t border-[#222]">
                <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1.5">{t('profile.nextAvailableSlot')}</div>
                <div className="text-sm font-bold text-white">
                  {todaySlots.length > 0 ? `${t('buttons.today')} · ${todaySlots[0]}` : t('profile.noSlotsToday')}
                </div>
              </div>
            </div>

            {/* CARD 2 — Availability */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">{t('profile.availabilityThisWeek')}</div>
              <div className="grid grid-cols-7 gap-1 mb-4">
                {weekDays.map(day => (
                  <div key={day.dateStr} className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-bold text-[#555]">{day.label}</span>
                    <div className={`w-7 h-7 rounded-lg text-[9px] font-black flex items-center justify-center ${
                      day.isToday
                        ? 'bg-[#1a1500] text-brand-yellow border border-brand-yellow/40'
                        : day.hasSlots
                          ? 'bg-[#0f2010] text-[#22c55e] border border-[#22c55e]/20'
                          : 'bg-[#141414] text-[#333]'
                    }`}>
                      {day.hasSlots ? (day.isToday ? '★' : '●') : '–'}
                    </div>
                  </div>
                ))}
              </div>
              {todaySlots.length > 0 && (
                <>
                  <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-2">{t('profile.todaysSlots')}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {todaySlots.map((slot: string) => (
                      isChallengeModeOn ? null : <button key={slot} onClick={() => handleBooking()} disabled={!profile.isLive}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors ${!profile.isLive ? 'bg-[#1a1a1a] border border-[#333] text-[#555] cursor-not-allowed' : 'bg-[#0f2010] border border-[#22c55e]/30 text-[#22c55e] hover:bg-[#22c55e]/20'}`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* CARD 3 — Track record */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">{t('profile.trackRecord')}</div>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]"
                  title={profile.experienceStartYear ? t('profile.cutsFromExperience').replace('{years}', String(yearsExperience)) : undefined}
                >
                  <div className="text-xl font-black text-white">{cutsLabel}</div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">{t('barberPublic.totalCuts')}</div>
                </div>
                {yearsExperience !== null && (
                  <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                    <div className="text-xl font-black text-white flex items-center gap-1.5">
                      {yearsExperience}
                      {profile.experienceVerified && (
                        <span
                          className="inline-block w-2 h-2 rounded-full bg-[#22c55e]"
                          title={t('barberSettings.verified')}
                        />
                      )}
                    </div>
                    <div className="text-[10px] text-[#555] font-bold mt-0.5">{t('barberPublic.yearsExperience')}</div>
                  </div>
                )}
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-[#22c55e]">98%</div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">{t('profile.completion')}</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-white">
                    {profile.avgResponseMinutes
                      ? profile.avgResponseMinutes >= 1440
                        ? `~${Math.round(profile.avgResponseMinutes / 1440)}d`
                        : profile.avgResponseMinutes >= 120
                        ? `~${Math.round(profile.avgResponseMinutes / 60)}h`
                        : profile.avgResponseMinutes >= 60
                        ? `~1h`
                        : `~${profile.avgResponseMinutes}min`
                      : t('profile.newMember')}
                  </div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">
                    {profile.avgResponseMinutes
                      ? t('profile.respondsIn').replace('{hours}', String(Math.max(1, Math.round(profile.avgResponseMinutes / 60))))
                      : t('profile.avgResponse')}
                  </div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-sm font-black text-white leading-tight">
                    {userProfile?.createdAt ? formatMemberSince(userProfile.createdAt) : t('profile.newMember')}
                  </div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">{t('profile.memberSince')}</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Mobile sticky booking bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-[#0A0A0A] border-t border-[#1A1A1A]">
        {isChallengeModeOn ? null : <button
          onClick={() => handleBooking()}
          disabled={!profile?.isLive}
          className="w-full py-4 rounded-2xl text-sm font-black tracking-wide bg-[#F5C518] text-black hover:bg-[#e6b800] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {t('buttons.bookNow')}
        </button>}
      </div>
    </>
  );
}
