'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Country, City } from 'country-state-city';

const PER_PAGE = 12;

// ─── helpers ─────────────────────────────────────────────────────────────────

function fisherYates<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function currencySymbol(c?: string): string {
  switch ((c ?? '').toUpperCase()) {
    case 'GBP': return '£';
    case 'USD': return '$';
    case 'MAD': return 'MAD ';
    default: return '€';
  }
}

function fmtLocation(country?: string, city?: string, street?: string): string {
  return [country, city, street].filter(Boolean).join(' · ');
}

function fmtLangVibe(langs?: string[], vibes?: string[]): string {
  const l = (langs ?? []).slice(0, 2).join(' · ');
  const v = (vibes ?? []).slice(0, 2).join(' · ');
  if (l && v) return `${l} | ${v}`;
  return l || v;
}

function getOpenStatus(availableSlots: Record<string, string[]> | null, todayDate: string) {
  if (!availableSlots) return null;
  const slots = availableSlots[todayDate] ?? [];
  if (slots.length === 0) return { open: false };
  const nowStr = `${String(new Date().getHours()).padStart(2, '0')}:00`;
  return { open: slots.includes(nowStr) };
}

// ─── types ───────────────────────────────────────────────────────────────────

type BarberCard = {
  id: string;
  profilePhotoUrl?: string;
  photoUrl?: string;
  firstName: string;
  lastName: string;
  country: string;
  city: string;
  street: string;
  languages: string[];
  vibes: string[];
  currency?: string;
  barberCode: string;
  isOpenNow: boolean;
  hasSchedule: boolean;
  minPrice: number | null;
};

// ─── data fetcher ─────────────────────────────────────────────────────────────

async function fetchBarbers(): Promise<BarberCard[]> {
  const snap = await getDocs(query(
    collection(db, 'barberProfiles'),
    where('isLive', '==', true),
    where('isSolo', '==', true),
  ));
  const profiles = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  if (profiles.length === 0) return [];

  const ids: string[] = profiles.map((p: any) => p.id);

  const [userSnaps, scheduleSnaps, serviceSnaps] = await Promise.all([
    Promise.all(ids.map(id => getDoc(doc(db, 'users', id)))),
    Promise.all(ids.map(id => getDoc(doc(db, 'schedules', `${id}_shard_0`)))),
    Promise.all(ids.map(id => getDocs(query(
      collection(db, 'services'),
      where('providerId', '==', id),
      where('providerType', '==', 'barber'),
      where('isActive', '==', true),
    )))),
  ]);

  // Unique shop addresses
  const shopIds = [...new Set(profiles.filter((p: any) => p.shopId).map((p: any) => p.shopId as string))];
  const shopMap: Record<string, any> = {};
  if (shopIds.length > 0) {
    const shopSnaps = await Promise.all(shopIds.map(id => getDoc(doc(db, 'barbershops', id))));
    shopSnaps.forEach((s, i) => { if (s.exists()) shopMap[shopIds[i]] = s.data(); });
  }

  const todayDate = new Date().toISOString().split('T')[0];
  const nowStr = `${String(new Date().getHours()).padStart(2, '0')}:00`;

  return profiles.map((p: any, i: number) => {
    const user = userSnaps[i].exists() ? (userSnaps[i].data() as any) : {};
    const sched = scheduleSnaps[i].exists() ? (scheduleSnaps[i].data() as any) : null;
    const todaySlots: string[] = sched?.availableSlots?.[todayDate] ?? [];
    const prices = serviceSnaps[i].docs
      .map(s => Number((s.data() as any).price) || 0)
      .filter(n => n > 0);
    const shop = p.shopId ? shopMap[p.shopId] : null;

    return {
      id: p.id,
      profilePhotoUrl: p.profilePhotoUrl,
      photoUrl: user.photoUrl,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      country: user.country || '',
      city: p.city || user.city || '',
      street: shop?.address?.street || p.address?.street || '',
      languages: p.languages || [],
      vibes: p.vibes || p.vibe || [],
      currency: p.currency,
      barberCode: p.barberCode || '',
      isOpenNow: todaySlots.includes(nowStr),
      hasSchedule: sched !== null,
      minPrice: prices.length > 0 ? Math.min(...prices) : null,
    };
  });
}

// ─── pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, onChange }: {
  page: number; total: number; onChange: (p: number) => void;
}) {
  const totalPages = Math.ceil(total / PER_PAGE);
  if (totalPages <= 1) return null;
  let start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  if (end - start < 4) start = Math.max(1, end - 4);
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i);

  return (
    <div className="flex items-center justify-center gap-1 mt-10">
      <button onClick={() => onChange(page - 1)} disabled={page === 1}
        className="px-3 py-2 text-sm font-bold text-[#888] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        ← Prev
      </button>
      {start > 1 && <>
        <button onClick={() => onChange(1)} className="w-8 h-8 rounded-lg text-sm font-bold text-[#888] hover:text-white">1</button>
        {start > 2 && <span className="text-[#555]">…</span>}
      </>}
      {pages.map(p => (
        <button key={p} onClick={() => onChange(p)}
          className={`w-8 h-8 rounded-lg text-sm font-bold transition-colors ${p === page ? 'bg-brand-yellow text-[#0a0a0a]' : 'text-[#888] hover:text-white'}`}>
          {p}
        </button>
      ))}
      {end < totalPages && <>
        {end < totalPages - 1 && <span className="text-[#555]">…</span>}
        <button onClick={() => onChange(totalPages)} className="w-8 h-8 rounded-lg text-sm font-bold text-[#888] hover:text-white">{totalPages}</button>
      </>}
      <button onClick={() => onChange(page + 1)} disabled={page === totalPages}
        className="px-3 py-2 text-sm font-bold text-[#888] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
        Next →
      </button>
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

export default function BarbersPage() {
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeFilter, setActiveFilter] = useState<{ city: string; country: string } | null>(null);
  const [nameSearch, setNameSearch] = useState('');
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const countries = Country.getAllCountries();
  const cities = countryCode ? (City.getCitiesOfCountry(countryCode) ?? []) : [];

  const { data: allBarbers = [], isLoading } = useQuery({
    queryKey: ['barbersListV2'],
    queryFn: fetchBarbers,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    let list = [...allBarbers];

    if (activeFilter) {
      list = list.filter(b =>
        b.city.toLowerCase() === activeFilter.city.toLowerCase() &&
        (!activeFilter.country || b.country.toLowerCase() === activeFilter.country.toLowerCase())
      );
    }

    if (nameSearch.trim()) {
      const q = nameSearch.trim().toLowerCase();
      list = list.filter(b =>
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.barberCode.toLowerCase().includes(q)
      );
    }

    return [
      ...fisherYates(list.filter(b => b.isOpenNow)),
      ...fisherYates(list.filter(b => !b.isOpenNow)),
    ];
  }, [allBarbers, activeFilter, nameSearch]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = () => {
    if (countryName && selectedCity) {
      setActiveFilter({ city: selectedCity, country: countryName });
      setPage(1);
    }
  };

  const clearAll = () => {
    setActiveFilter(null);
    setSelectedCity('');
    setCountryCode('');
    setCountryName('');
    setNameSearch('');
    setPage(1);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2">Find your barber</h1>
        <p className="text-[#888] font-bold text-lg mb-8">
          Browse barbers by city. Real availability. Book in seconds.
        </p>

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={countryCode}
              onChange={e => {
                const opt = countries.find(c => c.isoCode === e.target.value);
                setCountryCode(e.target.value);
                setCountryName(opt?.name ?? '');
                setSelectedCity('');
              }}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors"
            >
              <option value="">Choose a country</option>
              {countries.map(c => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
            </select>

            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              disabled={!countryCode}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Choose a city</option>
              {cities.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>

            <button onClick={handleSearch} disabled={!selectedCity}
              className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap">
              Search barbers →
            </button>
          </div>

          <input value={nameSearch} onChange={e => { setNameSearch(e.target.value); setPage(1); }}
            placeholder="Search by name... (optional)"
            className="w-full sm:max-w-sm bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]"
          />
        </div>

        {(activeFilter || nameSearch) && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {activeFilter && (
              <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold px-3 py-1 rounded-full">
                {activeFilter.city}, {activeFilter.country}
              </span>
            )}
            {nameSearch && (
              <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold px-3 py-1 rounded-full">
                &quot;{nameSearch}&quot;
              </span>
            )}
            <button onClick={clearAll} className="text-xs text-[#555] hover:text-white transition-colors">
              Clear all ✕
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        {/* Divider between search and grid */}
        <div className="h-px bg-[#1e1e1e] mb-5" />
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full items-stretch">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#141414] border border-[#222] rounded-[12px] h-[160px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">💈</div>
            <h3 className="text-xl font-black mb-2">
              {activeFilter ? `No barbers in ${activeFilter.city} yet` : 'No barbers yet'}
            </h3>
            <p className="text-[#555] text-sm mb-6">
              {activeFilter ? 'Know a barber there? Share titeZMe with them.' : 'Check back soon.'}
            </p>
            {activeFilter && (
              <button onClick={handleShare}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold px-6 py-3 rounded-full text-sm hover:border-[#444] transition-colors">
                {copied ? '✓ Copied!' : '🔗 Share titeZMe'}
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="text-xs font-bold text-[#555] mb-4">
              {filtered.length} barber{filtered.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full items-stretch">
              {paged.map(b => {
                const name = `${b.firstName} ${b.lastName}`.trim() || 'Barber';
                const photo = b.profilePhotoUrl || b.photoUrl;
                const sym = currencySymbol(b.currency);
                const displayLangs = b.languages.slice(0, 2);
                const extraLangs = b.languages.length > 2 ? b.languages.length - 2 : 0;

                return (
                  <Link key={b.id} href={`/barber/${b.id}`}
                    className="bg-[#141414] border border-[#222] rounded-[12px] p-[14px] cursor-pointer flex flex-col">

                    {/* ROW 1: Avatar + Name/Location */}
                    <div className="flex items-start gap-[10px]">

                      {/* Avatar — square with rounded corners */}
                      <div className="relative w-11 h-11 rounded-[10px] overflow-hidden bg-[#E8491D] shrink-0 flex items-center justify-center">
                        {photo ? (
                          <Image src={photo} alt={name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[20px] font-black text-white leading-none">{name[0]?.toUpperCase()}</span>
                        )}
                      </div>

                      {/* Name + badge + location */}
                      <div className="flex-1 min-w-0">
                        {/* Name row */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-[13px] text-white truncate">{name}</span>
                          <span className="text-[10px] text-[#555] font-semibold whitespace-nowrap shrink-0">New ✨</span>
                        </div>
                        {/* Location */}
                        {b.city && (
                          <div className="text-[11px] text-[#666] mt-[3px]">📍 {b.city}</div>
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#1e1e1e] my-[10px]" />

                    {/* Languages */}
                    {b.languages.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-[10px]">
                        {displayLangs.map((lang, i) => (
                          <span key={lang} className="flex items-center gap-1 text-[11px] text-[#888]">
                            {i > 0 && <span className="text-[#444]">·</span>}
                            <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] inline-block shrink-0" />
                            {lang}
                          </span>
                        ))}
                        {extraLangs > 0 && (
                          <span className="text-[11px] text-[#555]">+{extraLangs}</span>
                        )}
                      </div>
                    )}

                    {/* Bottom row: Price + View profile */}
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-[13px] font-bold text-white">
                        {b.minPrice !== null ? `from ${sym}${b.minPrice}` : 'On request'}
                      </span>
                      <span className="text-[12px] font-bold text-[#E8491D]">
                        View profile →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <Pagination page={page} total={filtered.length} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
