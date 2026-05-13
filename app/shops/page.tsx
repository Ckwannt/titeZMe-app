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

// ─── types ───────────────────────────────────────────────────────────────────

type ShopCard = {
  id: string;
  name: string;
  coverPhotoUrl?: string;
  country: string;
  city: string;
  street: string;
  barberCount: number;
  languages: string[];
  isOpenNow: boolean;
  hasSchedule: boolean;
  minPrice: number | null;
  currency?: string;
};

// ─── data fetcher ─────────────────────────────────────────────────────────────

async function fetchShops(): Promise<ShopCard[]> {
  const snap = await getDocs(query(
    collection(db, 'barbershops'),
    where('status', '==', 'active'),
  ));
  const shops = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
  if (shops.length === 0) return [];

  const ids: string[] = shops.map((s: any) => s.id);

  const [scheduleSnaps, serviceSnaps] = await Promise.all([
    Promise.all(ids.map(id => getDoc(doc(db, 'schedules', `${id}_shard_0`)))),
    Promise.all(ids.map(id => getDocs(query(
      collection(db, 'services'),
      where('providerId', '==', id),
      where('providerType', '==', 'shop'),
      where('isActive', '==', true),
    )))),
  ]);

  // Batch fetch barber profiles for language aggregation
  const allBarberIds = [...new Set(shops.flatMap((s: any) => (s.barbers as string[]) || []))];
  const barberMap: Record<string, any> = {};
  if (allBarberIds.length > 0) {
    const bSnaps = await Promise.all(allBarberIds.map(id => getDoc(doc(db, 'barberProfiles', id))));
    bSnaps.forEach((s, i) => { if (s.exists()) barberMap[allBarberIds[i]] = s.data(); });
  }

  const todayDate = new Date().toISOString().split('T')[0];
  const nowStr = `${String(new Date().getHours()).padStart(2, '0')}:00`;

  return shops.map((s: any, i: number) => {
    const sched = scheduleSnaps[i].exists() ? (scheduleSnaps[i].data() as any) : null;
    const todaySlots: string[] = sched?.availableSlots?.[todayDate] ?? [];
    const prices = serviceSnaps[i].docs
      .map(d => Number((d.data() as any).price) || 0)
      .filter(n => n > 0);
    const barberIds: string[] = s.barbers || [];
    const languages = [
      ...new Set(barberIds.flatMap(id => (barberMap[id]?.languages as string[]) || [])),
    ];

    return {
      id: s.id,
      name: s.name || 'Barbershop',
      coverPhotoUrl: s.coverPhotoUrl,
      country: s.address?.country || '',
      city: s.address?.city || '',
      street: s.address?.street || '',
      barberCount: barberIds.length,
      languages,
      isOpenNow: todaySlots.includes(nowStr),
      hasSchedule: sched !== null,
      minPrice: prices.length > 0 ? Math.min(...prices) : null,
      currency: 'EUR',
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

export default function ShopsPage() {
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeFilter, setActiveFilter] = useState<{ city: string; country: string } | null>(null);
  const [nameSearch, setNameSearch] = useState('');
  const [page, setPage] = useState(1);

  const countries = Country.getAllCountries();
  const cities = countryCode ? (City.getCitiesOfCountry(countryCode) ?? []) : [];

  const { data: allShops = [], isLoading } = useQuery({
    queryKey: ['shopsListV2'],
    queryFn: fetchShops,
    staleTime: 5 * 60 * 1000,
  });

  const filtered = useMemo(() => {
    let list = [...allShops];

    if (activeFilter) {
      list = list.filter(s =>
        s.city.toLowerCase() === activeFilter.city.toLowerCase() &&
        (!activeFilter.country || s.country.toLowerCase() === activeFilter.country.toLowerCase())
      );
    }

    if (nameSearch.trim()) {
      const q = nameSearch.trim().toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }

    return [
      ...fisherYates(list.filter(s => s.isOpenNow)),
      ...fisherYates(list.filter(s => !s.isOpenNow)),
    ];
  }, [allShops, activeFilter, nameSearch]);

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

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2">Find a barbershop</h1>
        <p className="text-[#888] font-bold text-lg mb-8">
          Browse barbershops by city. Meet the team. Book your spot.
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
              Search shops →
            </button>
          </div>

          <input value={nameSearch} onChange={e => { setNameSearch(e.target.value); setPage(1); }}
            placeholder="Search by shop name... (optional)"
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
        <div className="border-t border-[#1a1a1a] mt-4" />
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-[#111] border border-[#1e1e1e] rounded-[14px] h-[260px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-xl font-black mb-2">
              {activeFilter ? `No barbershops in ${activeFilter.city} yet` : 'No barbershops yet'}
            </h3>
            <p className="text-[#555] text-sm mb-6">
              {activeFilter ? 'Own a shop? Join titeZMe free.' : 'Check back soon.'}
            </p>
            <Link href="/signup"
              className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity inline-block">
              Join as a barber →
            </Link>
          </div>
        ) : (
          <>
            <div className="text-xs font-bold text-[#555] mb-4">
              {filtered.length} shop{filtered.length !== 1 ? 's' : ''} found
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {paged.map(s => {
                const location = fmtLocation(s.country, s.city, s.street);
                const sym = currencySymbol(s.currency);
                const initials = s.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
                const langLine = s.languages.slice(0, 3).join(' · ');

                return (
                  <Link key={s.id} href={`/shop/${s.id}`}
                    className="group bg-[#111] border border-[#1e1e1e] rounded-[14px] p-4 hover:border-[#F5C51855] transition-all flex flex-col items-center text-center">

                    {/* 1. Avatar */}
                    <div className="relative w-[52px] h-[52px] rounded-full overflow-hidden border border-[#2a2a2a] bg-[#1a1a1a] mb-3 shrink-0">
                      {s.coverPhotoUrl ? (
                        <Image src={s.coverPhotoUrl} alt={s.name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-lg text-white bg-[#E8491D]">
                          {initials}
                        </div>
                      )}
                    </div>

                    {/* 2. Name */}
                    <div className="font-extrabold text-[13px] text-white group-hover:text-brand-yellow transition-colors mb-1 w-full truncate">
                      {s.name}
                    </div>

                    {/* 3. Location */}
                    {location && (
                      <div className="text-[11px] text-[#555] font-bold mb-1.5 w-full truncate">
                        {location}
                      </div>
                    )}

                    {/* 4. Open/Closed */}
                    {s.hasSchedule && (
                      <div className={`flex items-center justify-center gap-1.5 text-[11px] font-bold mb-1.5 ${s.isOpenNow ? 'text-[#22C55E]' : 'text-[#666]'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.isOpenNow ? 'bg-[#22C55E]' : 'bg-[#444]'}`} />
                        {s.isOpenNow ? 'Open now' : 'Closed'}
                      </div>
                    )}

                    {/* 5. Barbers + Languages */}
                    <div className="text-[11px] text-[#555] font-bold mb-1.5 w-full truncate">
                      {s.barberCount > 0 ? `${s.barberCount} barber${s.barberCount !== 1 ? 's' : ''}` : 'New shop'}
                      {langLine ? ` · ${langLine}` : ''}
                    </div>

                    {/* 6. Price */}
                    <div className="text-[12px] font-black text-brand-yellow mb-3 mt-auto">
                      {s.minPrice !== null ? `from ${sym}${s.minPrice}` : 'Prices on request'}
                    </div>

                    {/* 7. CTA */}
                    <span className="block w-full bg-brand-yellow text-[#0a0a0a] font-black text-[12px] py-2 rounded-full text-center">
                      View shop →
                    </span>
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
