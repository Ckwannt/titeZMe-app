'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import {
  collection, query, where, getDocs, doc, getDoc,
  orderBy, onSnapshot,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// ─── types ───────────────────────────────────────────────────────────────────

type ShopData = {
  id: string;
  name?: string;
  description?: string;
  contactPhone?: string;
  address?: {
    street?: string; number?: string; floor?: string;
    city?: string; country?: string; postalCode?: string;
  };
  photos?: string[];
  videos?: string[];
  coverPhotoUrl?: string;
  status?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  googleMapsUrl?: string;
  titeZMeCut?: { durationMinutes?: number; price?: number; currency?: string };
  createdAt?: number;
  ownerId?: string;
};

type BarberInShop = {
  id: string;
  userId?: string;
  specialties?: string[];
  rating?: number;
  reviewCount?: number;
  languages?: string[];
  profilePhotoUrl?: string;
  isLive?: boolean;
  totalCuts?: number;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  availableToday?: boolean;
};

type ServiceDoc = {
  id: string;
  name?: string;
  price?: number;
  durationMinutes?: number;
  duration?: number;
  isActive?: boolean;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatMemberSince(ts: number): string {
  return new Date(ts).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function getOpenBadge(availableSlots: Record<string, string[]> | null, todayDate: string) {
  if (!availableSlots) return null;
  const slots = availableSlots[todayDate] ?? [];
  if (slots.length === 0) return { label: '🔴 Closed today', isOpen: false };
  const nowHour = new Date().getHours();
  const nowStr = `${String(nowHour).padStart(2, '0')}:00`;
  if (slots.includes(nowStr)) {
    const lastH = parseInt(slots[slots.length - 1]) + 1;
    return { label: `• Open · Closes ${String(lastH).padStart(2, '0')}:00`, isOpen: true };
  }
  if (nowHour < parseInt(slots[0])) return { label: `🔴 Closed · Opens at ${slots[0]}`, isOpen: false };
  return { label: '🔴 Closed today', isOpen: false };
}

function serviceIcon(name: string): string {
  const n = (name || '').toLowerCase();
  if (n.includes('shave') || n.includes('razor')) return '🪒';
  if (n.includes('beard') || n.includes('shape')) return '🧔';
  if (n.includes('kids') || n.includes('child')) return '👶';
  if (n.includes('combo')) return '🔥';
  if (n.includes('color') || n.includes('bleach') || n.includes('colour')) return '🎨';
  if (n.includes('classic')) return '💈';
  return '✂️';
}

function buildMapsUrl(address: ShopData['address'], googleMapsUrl?: string): string {
  if (googleMapsUrl) return googleMapsUrl;
  const q = encodeURIComponent(
    `${address?.street ?? ''} ${address?.number ?? ''}, ${address?.city ?? ''}, ${address?.country ?? ''}`
  );
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
}

// ─── component ───────────────────────────────────────────────────────────────

export default function ShopProfilePage() {
  const params = useParams();
  const shopId = params.shopId as string;
  const { user, appUser } = useAuth();
  const router = useRouter();

  const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [expandDesc, setExpandDesc] = useState(false);

  // Real-time: shop document
  const [shop, setShop] = useState<ShopData | null | undefined>(undefined);
  // Real-time: barbers in shop
  const [barberDocs, setBarberDocs] = useState<any[]>([]);
  // Real-time: shop schedule
  const [schedule, setSchedule] = useState<{ availableSlots?: Record<string, string[]> } | null>(null);

  useEffect(() => {
    if (!shopId) return;
    const unsub = onSnapshot(doc(db, 'barbershops', shopId), snap => {
      setShop(snap.exists() ? ({ id: snap.id, ...snap.data() } as ShopData) : null);
    });
    return () => unsub();
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;
    const q = query(
      collection(db, 'barberProfiles'),
      where('shopId', '==', shopId),
      where('isLive', '==', true),
    );
    const unsub = onSnapshot(q, snap => {
      setBarberDocs(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [shopId]);

  useEffect(() => {
    if (!shopId) return;
    const unsub = onSnapshot(doc(db, 'schedules', `${shopId}_shard_0`), snap => {
      setSchedule(snap.exists() ? (snap.data() as { availableSlots?: Record<string, string[]> }) : null);
    });
    return () => unsub();
  }, [shopId]);

  // Cached: shop services
  const { data: services = [] } = useQuery<ServiceDoc[]>({
    queryKey: ['shopPublicServices', shopId],
    queryFn: async () => {
      const q = query(
        collection(db, 'services'),
        where('providerId', '==', shopId),
        where('providerType', '==', 'shop'),
        where('isActive', '==', true),
        orderBy('price', 'asc'),
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => ({ id: d.id, ...d.data() } as ServiceDoc));
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!shopId,
  });

  // Cached: per-barber user info + schedules
  const barberIds = barberDocs.map((b: any) => b.id as string);

  const { data: barberDetails } = useQuery({
    queryKey: ['shopBarberDetails', ...barberIds],
    queryFn: async () => {
      if (barberIds.length === 0) return {} as Record<string, any>;
      const todayDate = new Date().toISOString().split('T')[0];
      const [userSnaps, scheduleSnaps] = await Promise.all([
        Promise.all(barberIds.map(id => getDoc(doc(db, 'users', id)))),
        Promise.all(barberIds.map(id => getDoc(doc(db, 'schedules', `${id}_shard_0`)))),
      ]);
      const result: Record<string, any> = {};
      barberIds.forEach((id, i) => {
        const u = userSnaps[i].exists() ? userSnaps[i].data() : {};
        const sched = scheduleSnaps[i].exists() ? (scheduleSnaps[i].data() as any) : null;
        const todaySlots: string[] = sched?.availableSlots?.[todayDate] ?? [];
        result[id] = { user: u, availableToday: todaySlots.length > 0 };
      });
      return result;
    },
    staleTime: 5 * 60 * 1000,
    enabled: barberIds.length > 0,
  });

  const barbers: BarberInShop[] = barberDocs.map((b: any) => ({
    id: b.id,
    userId: b.userId,
    specialties: b.specialties,
    rating: b.rating,
    reviewCount: b.reviewCount,
    languages: b.languages,
    profilePhotoUrl: b.profilePhotoUrl,
    isLive: b.isLive,
    totalCuts: b.totalCuts,
    firstName: barberDetails?.[b.id]?.user?.firstName,
    lastName: barberDetails?.[b.id]?.user?.lastName,
    photoUrl: barberDetails?.[b.id]?.user?.photoUrl,
    availableToday: barberDetails?.[b.id]?.availableToday ?? false,
  }));

  // ─── derived ─────────────────────────────────────────────────────────────

  const todayDate = new Date().toISOString().split('T')[0];
  const openBadge = getOpenBadge(schedule?.availableSlots ?? null, todayDate);
  const currency = shop?.titeZMeCut?.currency ?? '€';

  const allPrices = [
    ...(shop?.titeZMeCut?.price ? [shop.titeZMeCut.price] : []),
    ...services.map(s => s.price ?? 0).filter(p => p > 0),
  ];
  const minPrice = allPrices.length > 0 ? Math.min(...allPrices) : null;

  const allLanguages = [...new Set(barbers.flatMap(b => b.languages ?? []))];

  const ratedBarbers = barbers.filter(b => (b.reviewCount ?? 0) > 0);
  const shopRating = ratedBarbers.length > 0
    ? ratedBarbers.reduce((sum, b) => sum + (b.rating ?? 0), 0) / ratedBarbers.length
    : null;
  const totalCuts = barbers.reduce((sum, b) => sum + (b.totalCuts ?? 0), 0);

  // Week days grid
  const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const dow = d.getDay();
    return {
      dateStr,
      label: DAY_LABELS[dow === 0 ? 6 : dow - 1],
      isToday: i === 0,
      hasSlots: (schedule?.availableSlots?.[dateStr] ?? []).length > 0,
    };
  });

  // ─── actions ─────────────────────────────────────────────────────────────

  const handleServiceBook = (serviceId: string) => {
    if (!user) { router.push(`/login?redirect=/shop/${shopId}`); return; }
    if (appUser?.role !== 'client') { toast.error('You need a client account to book'); return; }
    if (!appUser?.isOnboarded) { router.push('/onboarding/client'); return; }
    const firstAvailable = barbers.find(b => b.availableToday && b.isLive);
    if (!firstAvailable) { toast.error('No barbers available right now'); return; }
    router.push(`/book/${firstAvailable.id}?context=shop&serviceId=${serviceId}`);
  };

  const handleBarberBook = (barberId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { router.push(`/login?redirect=/shop/${shopId}`); return; }
    if (appUser?.role !== 'client') { toast.error('You need a client account to book'); return; }
    if (!appUser?.isOnboarded) { router.push('/onboarding/client'); return; }
    router.push(`/book/${barberId}?context=shop`);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success('Link copied! 📋');
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTeam = () => {
    document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' });
  };

  // ─── guard states ─────────────────────────────────────────────────────────

  if (shop === undefined) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-start justify-center px-6 pt-12">
        <div className="w-full max-w-[1200px] flex gap-8">
          <div className="flex-1 space-y-4">
            <div className="h-24 bg-[#111] rounded-2xl animate-pulse" />
            <div className="h-[300px] bg-[#111] rounded-2xl animate-pulse" />
            <div className="h-[200px] bg-[#111] rounded-2xl animate-pulse" />
          </div>
          <div className="hidden lg:block w-[320px] space-y-4">
            <div className="h-[200px] bg-[#111] rounded-2xl animate-pulse" />
            <div className="h-[180px] bg-[#111] rounded-2xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (shop === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-2xl font-black mb-2">Shop not found</h1>
          <p className="text-[#888] mb-6">This shop doesn&apos;t exist.</p>
          <Link href="/shops" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full">Browse shops →</Link>
        </div>
      </div>
    );
  }

  if (shop.status !== 'active') {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
        <div className="text-center max-w-[400px]">
          <div className="text-5xl mb-4">🏪</div>
          <h1 className="text-xl font-black mb-2">This shop is not currently active</h1>
          <p className="text-[#888] text-sm mb-6">Check back later.</p>
          <Link href="/shops" className="bg-brand-yellow text-black font-black px-6 py-3 rounded-full">Browse other shops →</Link>
        </div>
      </div>
    );
  }

  const address = shop.address;
  const mapsUrl = buildMapsUrl(address, shop.googleMapsUrl);
  const shopInitials = (shop.name ?? 'S').split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

  // ─── render ───────────────────────────────────────────────────────────────

  return (
    <>
      {/* Lightbox */}
      {lightboxPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setLightboxPhoto(null)}
        >
          <button className="absolute top-4 right-4 text-white text-3xl font-black z-10">✕</button>
          <div className="relative w-full max-w-[80vw] max-h-[80vh] aspect-square">
            <Image src={lightboxPhoto} alt="Shop photo" fill className="object-contain" referrerPolicy="no-referrer" />
          </div>
        </div>
      )}

      <div className="bg-[#0a0a0a] min-h-screen text-white">
        {/* Breadcrumb */}
        <div className="max-w-[1200px] mx-auto px-6 pt-6">
          <div className="text-xs font-bold text-[#444]">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="mx-2">›</span>
            <Link href="/shops" className="hover:text-white transition-colors">Shops</Link>
            <span className="mx-2">›</span>
            <span className="text-[#888]">{shop.name}</span>
          </div>
        </div>

        {/* Two-column layout */}
        <div className="max-w-[1200px] mx-auto px-6 py-8 flex gap-8 items-start">

          {/* ── LEFT COLUMN ──────────────────────────────────────────────── */}
          <div className="flex-1 min-w-0">

            {/* Shop Header */}
            <div className="flex gap-5 items-start mb-8">
              <div className="relative w-20 h-20 rounded-[18px] overflow-hidden shrink-0 border border-[#2a2a2a] bg-[#1a1a1a]">
                {shop.coverPhotoUrl ? (
                  <Image src={shop.coverPhotoUrl} alt={shop.name ?? ''} fill className="object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white bg-[#E8491D]">
                    {shopInitials}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h1 className="text-[22px] font-black leading-tight mb-1">{shop.name}</h1>

                {openBadge && (
                  <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border mb-2 ${openBadge.isOpen ? 'bg-[#0f2010] border-[#22c55e]/30 text-[#22c55e]' : 'bg-[#1a0808] border-[#ef4444]/30 text-[#ef4444]'}`}>
                    {openBadge.label}
                  </span>
                )}

                {address && (
                  <div className="text-sm font-bold text-[#888] flex flex-wrap items-center gap-1.5 mt-1">
                    <span>
                      📍 {[address.street, address.number].filter(Boolean).join(' ')}
                      {address.city ? `, ${address.city}` : ''}
                      {address.country ? `, ${address.country}` : ''}
                    </span>
                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                      className="text-brand-yellow hover:underline text-xs font-black">
                      → Get directions
                    </a>
                  </div>
                )}

                {shop.description && (
                  <div className="mt-2">
                    <p className={`text-[#aaa] text-sm leading-relaxed ${expandDesc ? '' : 'line-clamp-3'}`}>
                      {shop.description}
                    </p>
                    {shop.description.length > 160 && (
                      <button onClick={() => setExpandDesc(e => !e)} className="text-xs font-bold text-[#555] hover:text-white mt-1">
                        {expandDesc ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </div>
                )}

                {/* Social links */}
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  {shop.instagram && (
                    <a href={`https://instagram.com/${shop.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-bold px-3 py-1 rounded-full transition-colors">
                      📸 @{shop.instagram.replace('@', '')}
                    </a>
                  )}
                  {shop.tiktok && (
                    <a href={`https://tiktok.com/@${shop.tiktok.replace('@', '')}`} target="_blank" rel="noopener noreferrer"
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-bold px-3 py-1 rounded-full transition-colors">
                      🎵 @{shop.tiktok.replace('@', '')}
                    </a>
                  )}
                  {shop.facebook && (
                    <a href={`https://facebook.com/${shop.facebook}`} target="_blank" rel="noopener noreferrer"
                      className="bg-[#1a1a1a] border border-[#2a2a2a] text-[#888] hover:text-white text-xs font-bold px-3 py-1 rounded-full transition-colors">
                      👤 {shop.facebook}
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* SECTION 1 — TEAM */}
            <div id="team" className="mb-10">
              <div className="mb-5">
                <h2 className="font-black text-lg">Our team</h2>
                <p className="text-xs text-[#555] font-bold mt-0.5">
                  {barbers.length} barbers · synced live from shop roster
                </p>
              </div>

              {barbers.length === 0 ? (
                <div className="border-2 border-dashed border-[#2a2a2a] rounded-2xl p-8 text-center">
                  <div className="text-[#555] text-sm font-bold">No barbers added yet.</div>
                  <div className="text-[#444] text-xs mt-1">Check back soon.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {barbers.map(b => {
                    const name = `${b.firstName ?? ''} ${b.lastName ?? ''}`.trim() || 'Barber';
                    const photo = b.profilePhotoUrl ?? b.photoUrl;
                    const isAvailable = (b.availableToday ?? false) && (b.isLive ?? false);
                    const specialties = b.specialties ?? [];
                    const languages = b.languages ?? [];

                    return (
                      <Link href={`/barber/${b.id}`} key={b.id}
                        className="group bg-[#111] border border-[#1a1a1a] rounded-2xl p-4 hover:border-[#2a2a2a] transition-all block"
                      >
                        {/* Avatar + name row */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="relative w-[52px] h-[52px] rounded-[14px] overflow-hidden shrink-0 border border-[#2a2a2a] bg-[#1a1a1a]">
                            {photo ? (
                              <Image src={photo} alt={name} fill className="object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-black text-xl text-[#0a0a0a] bg-gradient-to-br from-brand-orange to-brand-yellow">
                                {name[0]}
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-black text-sm group-hover:text-brand-yellow transition-colors truncate">
                                {name}
                              </span>
                              {b.id === shop.ownerId && (
                                <span style={{ background: '#1a1500', color: '#F5C518', border: '1px solid rgba(245,197,24,0.27)', fontSize: '9px', fontWeight: 800, padding: '2px 8px', borderRadius: '99px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  👑 Owner
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold mt-0.5">
                              {(b.reviewCount ?? 0) > 0 ? (
                                <span className="text-brand-yellow">
                                  {'★'.repeat(Math.round(b.rating ?? 0))} {b.rating?.toFixed(1)}
                                </span>
                              ) : (
                                <span className="text-[#555]">New ✨</span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Specialties */}
                        {specialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {specialties.slice(0, 3).map(s => (
                              <span key={s} className="bg-brand-yellow/10 text-brand-yellow text-[10px] font-black px-1.5 py-0.5 rounded border border-brand-yellow/20">
                                {s}
                              </span>
                            ))}
                            {specialties.length > 3 && (
                              <span className="text-[10px] text-[#555] font-bold">+{specialties.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* Open/off */}
                        <div className={`flex items-center gap-1.5 text-[11px] font-bold mb-2 ${isAvailable ? 'text-[#22c55e]' : 'text-[#555]'}`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${isAvailable ? 'bg-[#22c55e]' : 'bg-[#444]'}`} />
                          {isAvailable ? 'Open now' : 'Off today'}
                        </div>

                        {/* Languages */}
                        {languages.length > 0 && (
                          <div className="text-[11px] text-[#555] font-bold mb-3">
                            {languages.slice(0, 2).join(' · ')}{languages.length > 2 ? ` +${languages.length - 2}` : ''}
                          </div>
                        )}

                        {/* Book button */}
                        <button
                          onClick={e => isAvailable ? handleBarberBook(b.id, e) : e.preventDefault()}
                          disabled={!isAvailable}
                          className={`w-full py-2.5 rounded-xl font-black text-sm transition-colors ${isAvailable ? 'bg-white text-[#0a0a0a] hover:bg-brand-yellow' : 'bg-[#1a1a1a] text-[#444] cursor-not-allowed'}`}
                        >
                          {isAvailable ? `Book ${b.firstName ?? 'Barber'} →` : 'Unavailable'}
                        </button>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            {/* SECTION 2 — SERVICES */}
            <div className="mb-10">
              <div className="mb-5">
                <h2 className="font-black text-lg">Shop services &amp; prices</h2>
                <p className="text-xs text-[#555] font-bold mt-0.5">
                  Applies to all bookings through this shop · synced from dashboard
                </p>
              </div>

              <div className="flex flex-col gap-3">
                {/* titeZMe Cut — always first */}
                {shop.titeZMeCut && (
                  <div className="bg-[#0d0d00] border border-[#2a2a2a] border-l-[3px] border-l-brand-yellow rounded-xl p-4 flex justify-between items-center gap-3">
                    <div className="flex-1">
                      <div className="font-black text-sm flex items-center gap-1.5">⚡ titeZMe Cut 🔒</div>
                      <div className="text-[11px] text-[#666] mt-0.5">
                        The barber picks the cut based on your vibe and budget
                      </div>
                      <div className="text-[11px] text-[#444] mt-0.5">
                        ⏱ ~{shop.titeZMeCut.durationMinutes ?? 45} min
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="font-black text-brand-yellow">{currency}{shop.titeZMeCut.price}</div>
                      <button
                        onClick={() => handleServiceBook('titeZMeCut')}
                        className="bg-[#1a1a1a] text-white border border-[#333] hover:bg-brand-yellow hover:text-[#0a0a0a] hover:border-brand-yellow px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                )}

                {services.length === 0 && !shop.titeZMeCut && (
                  <div className="text-sm font-bold text-[#555] border-2 border-dashed border-[#2a2a2a] rounded-2xl p-6 text-center">
                    Services not listed yet. Contact the shop directly.
                  </div>
                )}

                {services.map(s => (
                  <div key={s.id} className="group bg-[#111] border border-[#2a2a2a] rounded-xl p-4 flex justify-between items-center hover:border-[#444] transition-colors">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-xl">{serviceIcon(s.name ?? '')}</span>
                      <div>
                        <div className="font-black text-sm text-white">{s.name}</div>
                        <div className="text-[11px] text-[#555] mt-0.5">⏱ {s.durationMinutes ?? s.duration} min</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="font-black text-brand-yellow">{currency}{s.price}</div>
                      <button
                        onClick={() => handleServiceBook(s.id)}
                        className="bg-[#1a1a1a] text-white border border-[#333] group-hover:bg-brand-yellow group-hover:text-[#0a0a0a] group-hover:border-brand-yellow px-4 py-2 rounded-xl text-xs font-bold transition-colors"
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3 — PHOTOS */}
            {(shop.photos?.length ?? 0) > 0 && (
              <div className="mb-10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-lg">Shop photos</h2>
                  {(shop.photos?.length ?? 0) > 4 && (
                    <span className="text-xs font-bold text-[#888]">See all {shop.photos!.length} →</span>
                  )}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {shop.photos!.slice(0, 4).map((photo, i) => (
                    <button key={i} onClick={() => setLightboxPhoto(photo)}
                      className="aspect-square rounded-[10px] overflow-hidden relative border border-[#2a2a2a] hover:border-brand-yellow transition-colors"
                    >
                      <Image src={photo} alt={`Shop photo ${i + 1}`} fill className="object-cover" referrerPolicy="no-referrer" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── RIGHT SIDEBAR ────────────────────────────────────────────── */}
          <div className="hidden lg:flex w-[320px] shrink-0 flex-col gap-4 sticky top-[80px]">

            {/* CARD 1 — CTA */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-1">
                Shop services starting from
              </div>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-[26px] font-black text-brand-yellow">
                  {minPrice !== null ? `€${minPrice}` : 'On request'}
                </span>
                {minPrice !== null && <span className="text-xs text-[#555] font-bold">/ service</span>}
              </div>

              <button onClick={scrollToTeam}
                className="w-full bg-brand-yellow text-[#0a0a0a] font-black py-3 rounded-full mb-2 hover:opacity-90 transition-opacity text-sm">
                Choose a barber →
              </button>

              {shop.contactPhone && (
                <a href={`tel:${shop.contactPhone}`}
                  className="w-full border border-[#2a2a2a] text-[#888] hover:border-white hover:text-white font-black py-3 rounded-full mb-2 transition-colors text-sm flex items-center justify-center gap-2">
                  📞 Call the shop
                </a>
              )}

              <button onClick={handleShare}
                className="w-full border border-[#2a2a2a] text-[#888] hover:text-white hover:border-[#444] font-black py-3 rounded-full transition-colors text-sm">
                {copied ? '✓ Copied!' : '🔗 Share shop'}
              </button>
            </div>

            {/* CARD 2 — SHOP INFO */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Shop info</div>
              <div className="flex flex-col gap-3">
                {address && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm shrink-0 mt-0.5">📍</span>
                    <div className="text-xs font-bold text-white leading-snug">
                      {[address.street, address.number].filter(Boolean).join(' ')}
                      {address.city ? `, ${address.city}` : ''}
                    </div>
                  </div>
                )}
                {shop.contactPhone && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm shrink-0">📞</span>
                    <a href={`tel:${shop.contactPhone}`} className="text-xs font-bold text-white hover:text-brand-yellow transition-colors">
                      {shop.contactPhone}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2.5">
                  <span className="text-sm shrink-0">👥</span>
                  <div className="text-xs font-bold text-white">{barbers.length} active barbers</div>
                </div>
                {allLanguages.length > 0 && (
                  <div className="flex items-start gap-2.5">
                    <span className="text-sm shrink-0 mt-0.5">🗣</span>
                    <div className="text-xs font-bold text-white">{allLanguages.join(' · ')}</div>
                  </div>
                )}
                {shop.createdAt && (
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm shrink-0">📅</span>
                    <div className="text-xs font-bold text-white">Since {formatMemberSince(shop.createdAt)}</div>
                  </div>
                )}
              </div>

              {/* Map box */}
              <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                className="mt-4 block bg-[#141414] border border-[#2a2a2a] rounded-xl p-4 hover:border-[#444] transition-colors group">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-2xl">🗺️</span>
                  <span className="text-xs font-black text-brand-yellow group-hover:underline">Open in Google Maps →</span>
                </div>
                <div className="text-[11px] text-[#555] font-bold">
                  {[address?.street, address?.number, address?.city].filter(Boolean).join(', ')}
                </div>
              </a>
            </div>

            {/* CARD 3 — SHOP HOURS */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-0.5">Shop hours</div>
              <div className="text-[10px] text-[#444] font-bold mb-3">synced to shop schedule</div>
              {schedule ? (
                <>
                  <div className="grid grid-cols-7 gap-1 mb-3">
                    {weekDays.map(day => (
                      <div key={day.dateStr} className="flex flex-col items-center gap-1">
                        <span className="text-[9px] font-bold text-[#555]">{day.label}</span>
                        <div className={`w-6 h-6 rounded-md text-[9px] font-black flex items-center justify-center ${
                          day.isToday
                            ? 'bg-[#1a1500] text-brand-yellow border border-brand-yellow/40'
                            : day.hasSlots
                              ? 'bg-[#0f2010] text-[#22c55e] border border-[#22c55e]/20'
                              : 'bg-[#141414] text-[#333]'
                        }`}>
                          {day.hasSlots ? (day.isToday ? '★' : '✓') : '–'}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {weekDays.map(day => (
                      <div key={day.dateStr}
                        className={`flex items-center justify-between text-[11px] font-bold ${day.isToday ? 'text-brand-yellow' : 'text-[#555]'}`}>
                        <span>{day.label}</span>
                        <span>{day.hasSlots ? 'Available' : '—'}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-[11px] text-[#555] font-bold">Hours not available</div>
              )}
            </div>

            {/* CARD 4 — TRACK RECORD */}
            <div className="bg-[#111] border border-[#2a2a2a] rounded-2xl p-5">
              <div className="text-[10px] font-black text-[#555] uppercase tracking-widest mb-3">Track record</div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  {shopRating ? (
                    <>
                      <div className="text-xl font-black text-brand-yellow">{shopRating.toFixed(1)}</div>
                      <div className="text-[10px] text-[#555] font-bold mt-0.5">Shop rating</div>
                    </>
                  ) : (
                    <>
                      <div className="text-sm font-black text-white">New ✨</div>
                      <div className="text-[10px] text-[#555] font-bold mt-0.5">Shop rating</div>
                    </>
                  )}
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-white">{barbers.length}</div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">Active barbers</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-xl font-black text-white">{totalCuts}</div>
                  <div className="text-[10px] text-[#555] font-bold mt-0.5">Total cuts</div>
                </div>
                <div className="bg-[#0a0a0a] rounded-xl p-3 border border-[#1a1a1a]">
                  <div className="text-sm font-black text-white leading-tight">
                    {shop.createdAt ? formatMemberSince(shop.createdAt) : 'New'}
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
