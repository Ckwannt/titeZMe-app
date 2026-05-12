'use client';

import { useState, useEffect, use } from 'react';
import { useAuth } from '@/lib/auth-context';
import {
  collection, query, where, getDocs, doc, getDoc,
  orderBy, limit, updateDoc, arrayUnion, arrayRemove, onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { BarberProfileSkeleton } from '@/components/skeletons';
import toast from 'react-hot-toast';

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

function getOpenStatus(slots: Record<string, string[]> | null, todayDate: string) {
  if (!slots) return { label: 'Schedule not set', color: 'text-[#666]' };
  const todaySlots = slots[todayDate] || [];
  if (todaySlots.length === 0) return { label: '🔴 Closed today', color: 'text-[#ef4444]' };
  const nowHour = new Date().getHours();
  const nowStr = `${String(nowHour).padStart(2, '0')}:00`;
  if (todaySlots.includes(nowStr)) {
    const lastH = parseInt(todaySlots[todaySlots.length - 1]) + 1;
    return { label: `🟢 Open now · Closes ${String(lastH).padStart(2, '0')}:00`, color: 'text-[#22c55e]' };
  }
  const firstHour = parseInt(todaySlots[0]);
  if (nowHour < firstHour) return { label: `🔴 Closed · Opens at ${todaySlots[0]}`, color: 'text-[#ef4444]' };
  return { label: '🔴 Closed for today', color: 'text-[#ef4444]' };
}

// ─── component ────────────────────────────────────────────────────────────────

export default function BarberProfilePage({ params }: { params: Promise<{ barberId: string }> }) {
  const resolvedParams = use(params);
  const barberId = resolvedParams.barberId;
  const { user, appUser } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [bookingContext, setBookingContext] = useState<'solo' | 'shop'>('solo');
  const [visibleReviews, setVisibleReviews] = useState(5);
  const [schedule, setSchedule] = useState<{ availableSlots?: Record<string, string[]> } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  // ─── queries ─────────────────────────────────────────────────────────────────

  const { data, isLoading } = useQuery({
    queryKey: ['barberPublicProfile', barberId],
    queryFn: async () => {
      const [pSnap, uSnap] = await Promise.all([
        getDoc(doc(db, 'barberProfiles', barberId)),
        getDoc(doc(db, 'users', barberId)),
      ]);
      if (!pSnap.exists()) return null;
      const profile = { id: pSnap.id, ...pSnap.data() } as BarberDoc;
      const userProfile = (uSnap.exists() ? uSnap.data() : {}) as UserDoc;
      let shop: ShopDoc | null = null;
      if (profile.shopId) {
        const shopSnap = await getDoc(doc(db, 'barbershops', profile.shopId));
        if (shopSnap.exists()) shop = { id: shopSnap.id, ...shopSnap.data() } as ShopDoc;
      }
      return { profile, userProfile, shop };
    },
    staleTime: 5 * 60 * 1000,
  });

  const { data: services = [] } = useQuery<ServiceDoc[]>({
    queryKey: ['barberPublicServices', barberId, bookingContext],
    queryFn: async () => {
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
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceDoc));
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!data,
  });

  const { data: reviews = [] } = useQuery<ReviewDoc[]>({
    queryKey: ['barberPublicReviews', barberId],
    queryFn: async () => {
      const q = query(
        collection(db, 'reviews'),
        where('providerId', '==', barberId),
        orderBy('createdAt', 'desc'),
        limit(20),
      );
      const snap = await getDocs(q);
      const list: ReviewDoc[] = [];
      for (const rDoc of snap.docs) {
        const rev = { id: rDoc.id, ...rDoc.data() } as ReviewDoc;
        if (rev.clientId) {
          const uSnap = await getDoc(doc(db, 'users', rev.clientId));
          if (uSnap.exists()) rev.user = uSnap.data() as ReviewDoc['user'];
        }
        list.push(rev);
      }
      return list;
    },
    staleTime: 5 * 60 * 1000,
  });

  // ─── real-time schedule ──────────────────────────────────────────────────────

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, 'schedules', `${barberId}_shard_0`),
      snap => {
        if (snap.exists()) setSchedule(snap.data() as { availableSlots?: Record<string, string[]> });
      },
    );
    return () => unsub();
  }, [barberId]);

  useEffect(() => {
    if (data?.profile) setBookingContext(data.profile.isSolo ? 'solo' : 'shop');
  }, [data?.profile?.isSolo]);

  // ─── derived ─────────────────────────────────────────────────────────────────

  const profile = data?.profile;
  const userProfile = data?.userProfile;
  const shop = data?.shop;
  const todayDate = new Date().toISOString().split('T')[0];
  const openStatus = getOpenStatus(schedule?.availableSlots || null, todayDate);
  const minPrice = services.length > 0 ? Math.min(...services.map(s => s.price || 0)) : null;
  const currency = profile?.currency || '€';
  const isFav = appUser?.favoriteBarbers?.includes(barberId);
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
    const dateStr = d.toISOString().split('T')[0];
    return {
      dateStr,
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      isToday: i === 0,
      hasSlots: (schedule?.availableSlots?.[dateStr] || []).length > 0,
    };
  });

  // ─── actions ─────────────────────────────────────────────────────────────────

  const handleBooking = (serviceId?: string) => {
    if (!user) { router.push(`/login?redirect=/barber/${barberId}`); return; }
    if (appUser?.role !== 'client') { toast.error('You need a client account to book'); return; }
    if (!appUser?.isOnboarded) { router.push('/onboarding/client'); return; }
    if (!profile?.isLive) { toast.error('This barber is not accepting bookings right now'); return; }
    const qs = new URLSearchParams({ context: bookingContext });
    if (serviceId) qs.set('serviceId', serviceId);
    router.push(`/book/${barberId}?${qs.toString()}`);
  };

  const handleToggleFav = async () => {
    if (!user) { router.push('/login'); return; }
    if (appUser?.role !== 'client') { toast.error('Only clients can save barbers'); return; }
    setIsSaving(true);
    try {
      if (isFav) {
        await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayRemove(barberId) });
        toast.success('Removed from saved');
      } else {
        await updateDoc(doc(db, 'users', user.uid), { favoriteBarbers: arrayUnion(barberId) });
        toast.success('Saved ✓');
      }
      queryClient.invalidateQueries({ queryKey: ['clientData', user.uid] });
    } catch (e) { console.error(e); }
    setIsSaving(false);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  // ─── guard states ─────────────────────────────────────────────────────────────

  if (isLoading) return <BarberProfileSkeleton />;

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💈</div>
          <h1 className="text-2xl font-black mb-2">Barber not found</h1>
          <p className="text-[#888] mb-6">This profile doesn&apos;t exist.</p>
          <Link href="/barbers" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full">Find barbers →</Link>
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

      <div className="bg-[#0a0a0a] min-h-screen text-white">
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <div className="text-xs font-bold text-[#444]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/barbers" className="hover:text-white transition-colors">Barbers</Link>
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
                {shop && profile.isSolo && <div className="text-xs text-[#555] mt-0.5">Also available for solo bookings</div>}

                <div className="flex flex-wrap items-center gap-3 mt-2 text-sm font-bold">
                  {(profile.reviewCount || 0) > 0 ? (
                    <div className="flex items-center gap-1">
                      <span className="text-brand-yellow">★</span>
                      <span>{typeof profile.rating === 'number' ? profile.rating.toFixed(1) : '—'}</span>
                      <span className="text-[#666]">({profile.reviewCount} reviews)</span>
                    </div>
                  ) : <span className="text-[#888]">New barber ✨</span>}
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
                    <div className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-2">🗣 Languages</div>
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
                    <div className="text-[10px] font-black text-[#888] uppercase tracking-widest mb-2">👥 Works with</div>
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
                  <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase">Their work</h3>
                  <span className="text-xs font-bold text-[#555]">See all {profile.photos!.length} →</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
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
              <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-5">What clients say</h3>
              {reviews.length > 0 ? (
                <>
                  <div className="flex items-start gap-6 mb-6 bg-[#111] border border-[#222] rounded-2xl p-5">
                    <div className="text-center shrink-0">
                      <div className="text-5xl font-black text-brand-yellow leading-none">
                        {typeof profile.rating === 'number' ? profile.rating.toFixed(1) : '—'}
                      </div>
                      <div className="text-brand-yellow text-sm mt-1">{'★'.repeat(Math.round(profile.rating || 0))}</div>
                      <div className="text-[11px] text-[#555] mt-1">{profile.reviewCount} reviews</div>
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
                      Load more reviews
                    </button>
                  )}
                </>
              ) : (
                <div className="border border-[#2a2a2a] bg-[#111] rounded-2xl p-8 text-center">
                  <div className="text-[#555] text-sm font-bold">No reviews yet.</div>
                  <div className="text-[#444] text-xs mt-1">Book {firstName} to be the first.</div>
                </div>
              )}
            </div>

            {/* SECTION 5 — Services */}
            <div>
              <h3 className="font-extrabold text-[11px] tracking-widest text-[#666] uppercase mb-4">Services &amp; prices</h3>

              {profile.isSolo && profile.shopId && shop && (
                <div className="flex gap-2 mb-4">
                  <button onClick={() => setBookingContext('solo')}
                    className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${bookingContext === 'solo' ? 'bg-brand-yellow text-[#0a0a0a] border-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:text-white'}`}
                  >
                    👤 Book {firstName} directly
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
                      <div className="font-black text-sm flex items-center gap-1.5">⚡ titeZMe Cut <span className="text-[#555] text-xs">🔒</span></div>
                      <div className="text-[11px] text-[#666] mt-0.5">{firstName} picks the cut based on your vibe and budget</div>
                      <div className="text-[11px] text-[#444] mt-0.5">⏱ {profile.titeZMeCut.durationMinutes} min</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="font-black text-brand-yellow">{currency}{profile.titeZMeCut.price}</div>
                      <button onClick={() => handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? 'Not accepting bookings right now' : undefined} className={`px-4 py-2 rounded-xl text-xs font-black transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`}>Book</button>
                    </div>
                  </div>
                )}

                {services.length === 0 && !profile.titeZMeCut && (
                  <div className="text-sm font-bold text-[#555] border-2 border-dashed border-[#2a2a2a] rounded-2xl p-6 text-center">No services listed yet.</div>
                )}

                {services.map((s: ServiceDoc) => (
                  <div key={s.id} className="group bg-[#111] border border-[#2a2a2a] rounded-2xl p-4 flex justify-between items-center hover:border-[#444] transition-colors">
                    <div className="flex-1">
                      <div className="font-black text-white text-sm">{s.name}</div>
                      <div className="text-[11px] text-[#555] mt-0.5">⏱ {s.durationMinutes || s.duration} min</div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="font-black text-brand-yellow">{currency}{s.price}</div>
                      <button onClick={() => handleBooking(s.id)} disabled={!profile.isLive} title={!profile.isLive ? 'Not accepting bookings right now' : undefined}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${!profile.isLive ? 'bg-[#1a1a1a] text-[#555] border border-[#2a2a2a] cursor-not-allowed' : 'bg-[#1a1a1a] text-white border border-[#333] group-hover:bg-brand-yellow group-hover:text-[#0a0a0a] group-hover:border-brand-yellow'}`}
                      >
                        Book
                      </button>
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
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1">Starting from</div>
              <div className="text-3xl font-black text-brand-yellow mb-4">
                {minPrice !== null ? `${currency}${minPrice}` : 'Prices on request'}
              </div>
              <button onClick={() => handleBooking()} disabled={!profile.isLive} title={!profile.isLive ? 'Not accepting bookings right now' : undefined}
                className={`w-full font-black py-3 rounded-full mb-2 text-sm transition-opacity ${!profile.isLive ? 'bg-[#2a2a2a] text-[#555] cursor-not-allowed' : 'bg-brand-yellow text-[#0a0a0a] hover:opacity-90'}`}
              >
                Book Now →
              </button>
              <button onClick={handleToggleFav} disabled={isSaving}
                className={`w-full py-3 rounded-full font-black text-sm mb-2 border transition-colors ${isFav ? 'bg-brand-yellow/10 border-brand-yellow text-brand-yellow' : 'border-[#2a2a2a] text-[#888] hover:border-white hover:text-white'}`}
              >
                {isFav ? '💛 Saved' : '🤍 Save barber'}
              </button>
              <button onClick={handleShare}
                className="w-full py-3 rounded-full font-black text-sm border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444] transition-colors"
              >
                {copied ? '✓ Copied!' : '🔗 Share profile'}
              </button>
              <div className="mt-4 pt-4 border-t border-[#222]">
                <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1.5">Next available slot</div>
                <div className="text-sm font-bold text-white">
                  {todaySlots.length > 0 ? `Today · ${todaySlots[0]}` : 'No slots available today'}
                </div>
              </div>
            </div>

            {/* CARD 2 — Availability */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Availability this week</div>
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
                  <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-2">Today&apos;s slots</div>
                  <div className="flex flex-wrap gap-1.5">
                    {todaySlots.map((slot: string) => (
                      <button key={slot} onClick={() => handleBooking()} disabled={!profile.isLive}
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
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Track record</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-white">{profile.totalCuts || 0}</div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">Total cuts</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-[#22c55e]">98%</div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">Completion</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-white">
                    {profile.avgResponseMinutes
                      ? profile.avgResponseMinutes >= 60
                        ? `~${Math.round(profile.avgResponseMinutes / 60)}h`
                        : `~${profile.avgResponseMinutes}min`
                      : 'New'}
                  </div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">Avg response</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-sm font-black text-white leading-tight">
                    {userProfile?.createdAt ? formatMemberSince(userProfile.createdAt) : 'New'}
                  </div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">Member since</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}
