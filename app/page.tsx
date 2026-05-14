'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  collection, query, where, getDocs, doc, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Footer } from '@/components/Footer';
import { getOpenStatus, getLocalDateString, getLocalHourString, getTimezoneFromLocation } from '@/lib/schedule-utils';

// ─── helpers ─────────────────────────────────────────────────────────────────

function normalizeCity(raw: string): string {
  const c = (raw || '').toLowerCase().trim();
  if (!c) return '';
  if (c.includes('casablanca')) return 'Casablanca';
  if (c.includes('marrakesh') || c.includes('marrakech')) return 'Marrakesh';
  if (c.includes('rabat')) return 'Rabat';
  if (c.includes('tangier') || c.includes('tanger')) return 'Tangier';
  if (c.includes('london') || c.includes('hackney') || c.includes('brixton') ||
      c.includes('camden') || c.includes('islington') || c.includes('lambeth')) return 'London';
  if (c.includes('paris') || c.includes('île-de-france') || c.includes('ile-de-france') ||
      c.includes('boulogne') || c.includes('vincennes') || c.includes('montreuil')) return 'Paris';
  if (c.includes('madrid') || c.includes('alcal') || c.includes('getafe') ||
      c.includes('leganes') || c.includes('alcorcón')) return 'Madrid';
  if (c.includes('barcelona') || c.includes('hospitalet') || c.includes('badalona')) return 'Barcelona';
  if (c.includes('seville') || c.includes('sevilla')) return 'Seville';
  if (c.includes('amsterdam')) return 'Amsterdam';
  if (c.includes('berlin')) return 'Berlin';
  if (c.includes('rome') || c.includes('roma')) return 'Rome';
  if (c.includes('milan') || c.includes('milano')) return 'Milan';
  if (c.includes('dubai')) return 'Dubai';
  return raw.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function getCurrencySymbol(currency?: string): { sym: string; label: string } {
  switch ((currency ?? '').toUpperCase()) {
    case 'MAD': return { sym: '', label: ' MAD' };
    case 'GBP': return { sym: '£', label: '' };
    case 'USD': return { sym: '$', label: '' };
    default:    return { sym: '€', label: '' };
  }
}

// ─── data fetchers ────────────────────────────────────────────────────────────

async function fetchFeaturedBarbers() {
  try {
    const snap = await getDocs(query(
      collection(db, 'barberProfiles'),
      where('isLive', '==', true),
      where('isSolo', '==', true),
    ));
    const profiles = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    if (profiles.length === 0) return [];

    const schedSnaps = await Promise.all(
      profiles.map((p: any) => getDoc(doc(db, 'schedules', `${p.id}_shard_0`)))
    );

    const withStatus = profiles.map((p: any, i: number) => {
      const sched = schedSnaps[i].exists() ? (schedSnaps[i].data() as any) : null;
      const status = getOpenStatus(sched?.availableSlots, p.city, p.country, p.id);
      // Also compute nextSlots for the featured card display
      const tz = getTimezoneFromLocation(p.city, p.country);
      const todayDate = getLocalDateString(tz);
      const nowStr = getLocalHourString(tz);
      const slots: string[] = sched?.availableSlots?.[todayDate] ?? [];
      const nextSlots = slots.filter((s: string) => s >= nowStr).slice(0, 2);
      return { ...p, isOpenNow: status.isOpen, nextSlots };
    });
    const groupA = withStatus.filter((b: any) => b.isOpenNow);
    const groupB = withStatus.filter((b: any) => !b.isOpenNow);
    for (let i = groupA.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [groupA[i], groupA[j]] = [groupA[j], groupA[i]];
    }
    for (let i = groupB.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [groupB[i], groupB[j]] = [groupB[j], groupB[i]];
    }
    const selected = [...groupA.slice(0, 3), ...groupB.slice(0, Math.max(0, 3 - groupA.length))];

    const [userSnaps, serviceSnaps] = await Promise.all([
      Promise.all(selected.map((p: any) => getDoc(doc(db, 'users', p.id)))),
      Promise.all(selected.map((p: any) => getDocs(query(
        collection(db, 'services'),
        where('providerId', '==', p.id),
        where('providerType', '==', 'barber'),
        where('isActive', '==', true),
      )))),
    ]);

    return selected.map((p: any, i: number) => {
      const user = userSnaps[i].exists() ? (userSnaps[i].data() as any) : {};
      const prices = serviceSnaps[i].docs
        .map(d => Number((d.data() as any).price) || 0).filter(n => n > 0);
      return {
        ...p,
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        userCity: user.city || p.city || '',
        photoUrl: p.profilePhotoUrl || user.photoUrl,
        minPrice: prices.length > 0 ? Math.min(...prices) : null,
        maxPrice: prices.length > 0 ? Math.max(...prices) : null,
      };
    });
  } catch {
    return [];
  }
}

async function fetchCitiesData(): Promise<{ city: string; barbers: number; shops: number }[]> {
  try {
    const [shopsSnap, barbersSnap] = await Promise.all([
      getDocs(query(collection(db, 'barbershops'), where('status', '==', 'active'))),
      getDocs(query(collection(db, 'barberProfiles'), where('isLive', '==', true))),
    ]);
    const bc: Record<string, number> = {};
    const sc: Record<string, number> = {};
    barbersSnap.docs.forEach(d => {
      const city = normalizeCity((d.data() as any).city || '');
      if (city) bc[city] = (bc[city] || 0) + 1;
    });
    shopsSnap.docs.forEach(d => {
      const city = normalizeCity((d.data() as any).address?.city || '');
      if (city) sc[city] = (sc[city] || 0) + 1;
    });
    const all = new Set([...Object.keys(bc), ...Object.keys(sc)]);
    return Array.from(all)
      .map(city => ({ city, barbers: bc[city] || 0, shops: sc[city] || 0 }))
      .sort((a, b) => (b.barbers + b.shops) - (a.barbers + a.shops))
      .slice(0, 8);
  } catch {
    return [];
  }
}

const COMING_SOON = ['Amsterdam', 'Berlin', 'Rome', 'Dubai', 'London', 'Barcelona'];

// ─── component ───────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { data: featuredBarbers = [] } = useQuery({
    queryKey: ['landing_featured'],
    queryFn: fetchFeaturedBarbers,
    staleTime: 0,
  });

  const { data: citiesData = [] } = useQuery({
    queryKey: ['landing_cities_v2'],
    queryFn: fetchCitiesData,
    staleTime: 5 * 60 * 1000,
  });

  const citySlots = [...citiesData];
  for (const cs of COMING_SOON) {
    if (citySlots.length >= 8) break;
    if (!citySlots.some(c => c.city === cs)) {
      citySlots.push({ city: cs, barbers: 0, shops: 0 });
    }
  }

  // Helpers for featured barber cards
  const mainBarber = featuredBarbers[0] as any;
  const smallBarbers = featuredBarbers.slice(1, 3) as any[];

  return (
    <div className="bg-[#0A0A0A] text-white pt-24 min-h-screen font-sans">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 pt-8 pb-32">
        <div className="flex flex-col lg:flex-row gap-20">

          {/* Left column */}
          <div className="flex-1 animate-fadeUp">
            <div className="inline-flex items-center gap-2 border border-[#2a2a2a] rounded-full px-3 py-1 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-green"></div>
              <span className="text-xs font-bold text-gray-500">2,400+ barbers · 18 cities · live now</span>
            </div>

            <h1 className="text-6xl md:text-[88px] font-black leading-[0.95] tracking-tight mb-8">
              Find your <br className="hidden md:block"/>
              <span className="text-brand-yellow">perfect cut.</span><br/>
              <span className="text-[#333]">Right now.</span>
            </h1>

            <p className="text-lg text-gray-400 font-bold mb-10 max-w-[480px] leading-relaxed">
              Top-rated barbers in your city. Real availability. Cash only — no fees, no apps, no nonsense. Book in under 30 seconds.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link href="/barbers"
                className="bg-[#F5C518] text-[#0a0a0a] font-black px-7 py-3.5 rounded-full text-[15px] hover:opacity-90 transition-opacity">
                Find a barber →
              </Link>
              <Link href="/shops"
                className="border-2 border-[#2a2a2a] text-white font-extrabold px-7 py-3.5 rounded-full text-[15px] hover:bg-[#1a1a1a] transition-colors">
                Find a barbershop →
              </Link>
            </div>

            <div className="flex gap-8 md:gap-12 md:max-w-md justify-between">
              <div>
                <div className="text-[32px] font-black text-brand-yellow leading-tight mb-1">2.4k+</div>
                <div className="text-xs text-gray-500 font-bold">Barbers</div>
              </div>
              <div>
                <div className="text-[32px] font-black text-white leading-tight mb-1">4.97</div>
                <div className="text-xs text-gray-500 font-bold">Avg rating</div>
              </div>
              <div>
                <div className="text-[32px] font-black text-white leading-tight mb-1">551</div>
                <div className="text-xs text-gray-500 font-bold">Booked today</div>
              </div>
              <div>
                <div className="text-[32px] font-black text-brand-yellow leading-tight mb-1">0%</div>
                <div className="text-xs text-gray-500 font-bold">Fees</div>
              </div>
            </div>
          </div>

          {/* Right column — real open barbers */}
          {featuredBarbers.length > 0 && mainBarber && (
            <div className="flex-1 lg:max-w-[440px] animate-fadeUp mt-10 lg:mt-0">

              {/* Main featured card */}
              {(() => {
                const name = `${mainBarber.firstName} ${mainBarber.lastName}`.trim() || 'Barber';
                const vibes: string[] = mainBarber.vibes || mainBarber.vibe || [];
                const specialties: string[] = mainBarber.specialties || [];
                const languages: string[] = mainBarber.languages || [];
                const { sym, label } = getCurrencySymbol(mainBarber.currency);
                const hasRating = typeof mainBarber.rating === 'number' && mainBarber.rating > 0;
                return (
                  <div className="bg-[#111] border border-[#1e1e1e] rounded-[16px] p-5 mb-[10px] relative">
                    {/* FEATURED label */}
                    <div className="absolute top-4 right-4 text-[9px] font-black uppercase tracking-widest text-brand-orange">
                      {mainBarber.isOpenNow ? 'FEATURED | OPEN NOW' : 'FEATURED'}
                    </div>
                    {/* Top row: avatar + name/city/rating */}
                    <div className="flex gap-3 items-start mb-4 pr-24">
                      {mainBarber.photoUrl ? (
                        <Image src={mainBarber.photoUrl} alt={name} width={52} height={52}
                          className="rounded-[12px] object-cover shrink-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-[52px] h-[52px] rounded-[12px] bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center font-black text-xl text-[#0a0a0a] shrink-0">
                          {name[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[15px] font-extrabold text-white leading-tight truncate">{name}</h3>
                        <div className="text-[12px] text-[#666] mt-0.5">{mainBarber.userCity}</div>
                        <div className="text-[12px] font-bold text-brand-yellow mt-0.5">
                          ★ {hasRating ? mainBarber.rating.toFixed(2) : 'New ✨'}
                          {(mainBarber.reviewCount || 0) > 0 && (
                            <span className="text-[#555] font-normal text-[10px] ml-1">({mainBarber.reviewCount} reviews)</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {/* Specialty + vibe tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {specialties.slice(0, 2).map((s: string) => (
                        <span key={s} className="bg-[#1a1500] text-brand-yellow border border-brand-yellow/20 rounded-[4px] px-2 py-0.5 text-[10px] font-black uppercase">{s}</span>
                      ))}
                      {vibes.slice(0, 1).map((v: string) => (
                        <span key={v} className="bg-[#141414] text-[#888] border border-[#1a1a1a] rounded-[4px] px-2 py-0.5 text-[10px] font-bold">{v}</span>
                      ))}
                    </div>
                    {/* Languages */}
                    {languages.length > 0 && (
                      <div className="text-[12px] text-[#888] font-bold mb-3">
                        🗣 {languages.slice(0, 3).join(' · ')}
                      </div>
                    )}
                    {/* Next slots inset box */}
                    <div className="bg-[#0d0d0d] border border-[#1a1a1a] rounded-[10px] px-[14px] py-[12px] mb-3">
                      <div className="text-[9px] font-black uppercase text-[#444] tracking-[0.08em] mb-2">NEXT AVAILABLE SLOTS</div>
                      <div className="flex gap-2 flex-wrap">
                        {mainBarber.nextSlots && mainBarber.nextSlots.length > 0 ? (
                          mainBarber.nextSlots.map((s: string) => (
                            <span key={s} className="bg-brand-yellow text-[#0a0a0a] rounded-full px-[14px] py-[6px] text-[11px] font-extrabold">
                              Today {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-[#555] font-bold">No slots today</span>
                        )}
                      </div>
                    </div>
                    {/* Price + Book Now */}
                    <div className="flex justify-between items-center">
                      <div className="text-[18px] font-black text-white">
                        {mainBarber.minPrice !== null
                          ? `${sym}${mainBarber.minPrice}${mainBarber.maxPrice && mainBarber.maxPrice !== mainBarber.minPrice ? `-${sym}${mainBarber.maxPrice}` : ''}${label}`
                          : 'Prices on request'}
                      </div>
                      <Link href="/barbers" className="bg-brand-yellow text-[#0a0a0a] rounded-full font-black text-[13px] px-5 py-[10px] hover:opacity-90 transition-opacity">
                        Book Now →
                      </Link>
                    </div>
                  </div>
                );
              })()}

              {/* Two small cards */}
              {smallBarbers.length > 0 && (
                <div className="grid grid-cols-2 gap-[10px]">
                  {smallBarbers.map((b: any) => {
                    const name = `${b.firstName} ${b.lastName}`.trim() || 'Barber';
                    const { sym, label } = getCurrencySymbol(b.currency);
                    const hasRating = typeof b.rating === 'number' && b.rating > 0;
                    return (
                      <Link href="/barbers" key={b.id}
                        className={`border border-[#1e1e1e] rounded-[12px] p-3 flex gap-2.5 items-center hover:border-[#2a2a2a] transition-colors ${b.isOpenNow ? 'bg-[#111]' : 'bg-[#0d0d0d]'}`}>
                        {b.photoUrl ? (
                          <Image src={b.photoUrl} alt={name} width={36} height={36}
                            className="rounded-[9px] object-cover shrink-0" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-9 h-9 rounded-[9px] bg-gradient-to-br from-brand-orange to-brand-yellow flex items-center justify-center font-black text-sm text-[#0a0a0a] shrink-0">
                            {name[0]}
                          </div>
                        )}
                        <div className="min-w-0">
                          <div className="text-[12px] font-extrabold text-white truncate">{name}</div>
                          <div className="text-[10px] text-[#555] mt-0.5">
                            ★ {hasRating ? b.rating.toFixed(1) : 'New'}{b.minPrice !== null ? ` · ${sym}${b.minPrice}${label}` : ''}
                          </div>
                          <div className={`text-[9px] font-extrabold mt-0.5 ${b.isOpenNow ? 'text-[#22c55e]' : 'text-[#555]'}`}>
                            ● {b.isOpenNow ? 'Open Now' : 'Closed'}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

            </div>
          )}
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────────────────────── */}
      <section className="bg-[#050505] py-24 px-6 border-y border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid lg:grid-cols-[1fr_2.5fr] gap-12">
            <div>
              <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">SOCIAL PROOF</div>
              <h2 className="text-5xl font-black leading-[1.1] mb-2">Real clients.</h2>
              <h2 className="text-4xl font-bold text-gray-500 mb-8">Real talk.</h2>
              <div className="bg-[#0f0f0f] p-6 rounded-3xl border border-[#1a1a1a] inline-block">
                <div className="text-5xl font-black text-brand-yellow mb-1">4.9</div>
                <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">Overall Rating</div>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { n: 'Sarah K.', r: "Booked in 30 seconds. Best fade I've had in years. No one showed up late. This is how it should work.", i: 'SK' },
                { n: 'Marco B.', r: 'Finally a platform that respects the barber AND the client. Carlos manages his slots properly. Top tier.', i: 'MB' },
                { n: 'Emma W.', r: "Found a barber who speaks Arabic AND does proper fades in Madrid. TiteZMe solved something I'd been struggling with for months.", i: 'EW' },
              ].map((rev, i) => (
                <div key={i} className="bg-[#111] border border-[#2a2a2a] p-6 rounded-3xl flex flex-col justify-between">
                  <div>
                    <div className="flex gap-1 text-brand-yellow mb-4 text-xs">★★★★★</div>
                    <p className="text-sm font-bold text-gray-300 leading-relaxed mb-6">&quot;{rev.r}&quot;</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center text-[10px] font-black text-gray-400">{rev.i}</div>
                    <div className="text-xs font-bold text-white uppercase tracking-wider">{rev.n}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 bg-[#111] border border-[#2a2a2a] p-6 rounded-3xl">
            <div className="flex flex-col items-center justify-center border-r border-[#2a2a2a]/50">
              <div className="text-3xl font-black text-brand-yellow mb-1">4.9</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">avg rating</div>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-[#2a2a2a]/50 px-4 w-full">
              <div className="w-full flex items-center gap-2 mb-1"><span className="text-[10px] text-gray-500">5★</span><div className="h-1.5 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="w-[87%] h-full bg-brand-yellow"></div></div></div>
              <div className="w-full flex items-center gap-2 mb-1"><span className="text-[10px] text-gray-500">4★</span><div className="h-1.5 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="w-[10%] h-full bg-brand-yellow opacity-50"></div></div></div>
              <div className="w-full flex items-center gap-2"><span className="text-[10px] text-gray-500">3★</span><div className="h-1.5 flex-1 bg-[#2a2a2a] rounded-full overflow-hidden"><div className="w-[3%] h-full bg-brand-yellow opacity-25"></div></div></div>
            </div>
            <div className="flex flex-col items-center justify-center border-r border-[#2a2a2a]/50">
              <div className="text-3xl font-black text-white mb-1">11,400+</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">bookings made</div>
            </div>
            <div className="flex flex-col items-center justify-center">
              <div className="text-3xl font-black text-white mb-1">98%</div>
              <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center">completion rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section id="how-it-works" className="bg-[#0A0A0A] py-32 px-6">
        <div className="max-w-[1200px] mx-auto text-center mb-20">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">HOW IT WORKS</div>
          <h2 className="text-4xl md:text-5xl font-black">Booked in 3 steps. No drama.</h2>
        </div>
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-12 lg:gap-20">
          {[
            { n: '01', t: 'Pick your city', d: 'Open the app on any device or browser. We detect your location automatically, or choose your city and availability.', i: '📍' },
            { n: '02', t: 'Choose your barber', d: "Filter by specialty, language, vibe, price. See who's open right now in real time this very minute.", i: '✂️' },
            { n: '03', t: 'Show up. Pay cash.', d: 'Book in under 30 seconds. Arrive, get the cut you chose directly. Zero drama. 100% real.', i: '💵' },
          ].map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[180px] font-black text-[#111] leading-none z-0 tracking-tighter" style={{ marginTop: '-60px' }}>{step.n}</div>
              <div className="z-10 relative">
                <div className="w-16 h-16 mx-auto bg-[#141414] border border-[#2a2a2a] rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-xl">{step.i}</div>
                <h3 className="text-xl font-black mb-3">{step.t}</h3>
                <p className="text-sm font-bold text-gray-400 leading-relaxed max-w-[280px] mx-auto">{step.d}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOR BARBERS ─────────────────────────────────────────────────────── */}
      <section id="for-barbers" className="bg-[#111] py-24 px-6 border-y border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 items-center">
          <div>
            <div className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">FOR BARBERS</div>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Your chair. <br/>
              <span className="text-brand-yellow">Your rules.</span> <br/>
              <span className="text-brand-yellow">Your money.</span>
            </h2>
            <p className="text-lg font-bold text-gray-400 mb-10 max-w-[420px]">
              No commission fees during beta. Set your hours, set your price, keep everything. We send clients to your chair.
            </p>
            <div className="flex flex-col gap-4 mb-10">
              {['0% commission — keep every dirham/euro', 'Profile live in under 10 minutes', 'Your own schedule — no one owns your time', 'Clients find you — you just cut'].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-brand-yellow text-xs font-black">✓</span>
                  </div>
                  <span className="font-bold text-gray-300">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90">
                Join free during beta →
              </Link>
              <Link href="/how-it-works" className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors">
                See how it works
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-5xl font-black text-brand-yellow mb-2">0%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">commission</div>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-5xl font-black text-white mb-2">10 min</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">to set up your profile</div>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px] border border-brand-yellow/20">
              <div className="text-5xl font-black text-white mb-2">400+</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">barbers already joined</div>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-3xl font-black text-brand-orange mb-2">Beta = Free</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Join now, pay nothing during beta</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR SHOPS ───────────────────────────────────────────────────────── */}
      <section id="for-shops" className="bg-[#111] py-24 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto grid lg:grid-cols-[1.2fr_1fr] gap-16 lg:gap-8 items-center">
          <div>
            <div className="text-xs font-bold text-brand-orange uppercase tracking-widest mb-4">FOR SHOPS</div>
            <h2 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-6">
              Your shop. <br/>
              <span className="text-brand-yellow">Your team.</span> <br/>
              <span className="text-brand-yellow">Your reputation.</span>
            </h2>
            <p className="text-lg font-bold text-gray-400 mb-10 max-w-[420px]">
              Manage your barbers, track performance, and let clients find your shop online. All in one place. Zero paperwork.
            </p>
            <div className="flex flex-col gap-4 mb-10">
              {['Invite barbers by their unique code', 'See earnings per barber per month', 'Your own public shop profile', 'Clients book directly with your team'].map((text, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-6 h-6 rounded-full bg-brand-yellow/10 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-brand-yellow text-xs font-black">✓</span>
                  </div>
                  <span className="font-bold text-gray-300">{text}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/signup" className="bg-brand-yellow text-black font-black px-8 py-4 rounded-full transition-opacity hover:opacity-90">
                Create your shop →
              </Link>
              <Link href="/how-it-works" className="border border-[#2a2a2a] text-white font-bold px-8 py-4 rounded-full hover:bg-[#1a1a1a] transition-colors">
                See how it works
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-5xl font-black text-brand-yellow mb-2">Free</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">during beta</div>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-5xl font-black text-white mb-2">4</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">steps to set up</div>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px] border border-brand-yellow/20">
              <div className="text-5xl font-black text-white mb-2">100%</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">data visibility</div>
            </div>
            <div className="bg-[#1a1a1a] p-8 rounded-3xl flex flex-col justify-center min-h-[180px]">
              <div className="text-3xl font-black text-brand-orange mb-2">24/7</div>
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">booking management</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CITIES ──────────────────────────────────────────────────────────── */}
      <section id="cities" className="bg-[#0A0A0A] py-24 px-6 border-b border-[#1a1a1a]">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">CITIES</div>
          <h2 className="text-4xl md:text-5xl font-black mb-12">We&apos;re live where you are</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {citySlots.slice(0, 8).map((city, i) => {
              const isLive = city.barbers > 0 || city.shops > 0;
              const isFirst = i === 0 && isLive;
              return (
                <div key={city.city} className={`p-6 rounded-3xl border transition-colors ${isLive ? 'bg-[#111] border-[#2a2a2a] hover:border-brand-yellow/50' : 'bg-[#0f0f0f] border-[#1a1a1a] opacity-60'}`}>
                  {isFirst && <div className="text-[10px] font-black text-black bg-brand-yellow inline-block px-2 py-0.5 rounded mb-3 uppercase tracking-wider">Most popular</div>}
                  <h3 className="text-xl font-black text-white mb-1">{city.city}</h3>
                  <div className="text-xs font-bold text-gray-500 mb-6">
                    {isLive
                      ? `${city.barbers} barber${city.barbers !== 1 ? 's' : ''}${city.shops > 0 ? ` · ${city.shops} shop${city.shops !== 1 ? 's' : ''}` : ''}`
                      : 'Coming soon'}
                  </div>
                  {isLive ? (
                    <Link href="/barbers" className="text-sm font-black text-brand-yellow">Explore →</Link>
                  ) : (
                    <button className="text-sm font-bold text-gray-600">Request it →</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────────────────────────────── */}
      <section id="contact" className="bg-brand-yellow text-black py-32 px-6 text-center">
        <div className="max-w-[800px] mx-auto">
          <div className="text-[11px] font-black uppercase tracking-widest mb-6 opacity-70">ONE LAST THING</div>
          <h2 className="text-5xl md:text-7xl font-black leading-[0.9] tracking-tight">
            Your next cut is <br/> 30 seconds away.
          </h2>
        </div>
      </section>

      <Footer />
    </div>
  );
}
