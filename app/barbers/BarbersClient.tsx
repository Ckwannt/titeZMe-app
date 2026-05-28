'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { algoliasearch } from 'algoliasearch';
// country-state-city loaded dynamically to avoid bundling 1.8 MB on initial load
import { locationsMatch } from '@/lib/location-utils';
import { useDebounce } from '@/hooks/useDebounce';
import type { BarberCard } from './page';

const algoliaClient = algoliasearch(
  process.env.NEXT_PUBLIC_ALGOLIA_APP_ID!,
  process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY!
);

// ─── open status helper ───────────────────────────────────────────────────────

function computeOpenStatus(
  weeklyDays: string[],
  opensAt: string,
  closesAt: string
) {
  if (!weeklyDays || weeklyDays.length === 0) {
    return {
      isOpenNow:   false,
      openLabel:   '',
      openColor:   '',
      hasSchedule: false,
    };
  }
  const now = new Date();
  const dayName = now.toLocaleDateString(
    'en-US', { weekday: 'short' }
  );
  const currentTime = [
    now.getHours().toString().padStart(2, '0'),
    now.getMinutes().toString().padStart(2, '0'),
  ].join(':');
  const isOpenNow =
    weeklyDays.includes(dayName) &&
    currentTime >= (opensAt  || '00:00') &&
    currentTime <= (closesAt || '23:59');
  return {
    isOpenNow,
    openLabel:   isOpenNow ? 'Open now' : 'Closed',
    openColor:   isOpenNow ? 'green'    : 'gray',
    hasSchedule: true,
  };
}

// ─── client-side data fetcher ─────────────────────────────────────────────────

async function fetchBarbers(): Promise<BarberCard[]> {
  const response = await algoliaClient.search({
    requests: [{
      indexName: 'barbers',
      query:     '',
      filters:
        'isLive:true AND ' +
        'approvalStatus:approved AND ' +
        'isSolo:true',
      hitsPerPage: 1000,
    }],
  });

  const hits =
    (response.results[0] as any).hits as any[];

  return hits.map((hit: any) => ({
    id:             hit.objectID,
    firstName:      hit.firstName      || '',
    lastName:       hit.lastName       || '',
    profilePhotoUrl: hit.photoUrl      || '',
    photoUrl:       hit.photoUrl       || '',
    city:           hit.city           || '',
    country:        hit.country        || '',
    languages:      hit.languages      || [],
    vibes:          hit.vibes          || [],
    currency:       hit.currency       || 'EUR',
    barberCode:     hit.barberCode     || '',
    street:         '',
    minPrice:       hit.minPrice       || 0,
    ...computeOpenStatus(
      hit.weeklyDays || [],
      hit.opensAt    || '09:00',
      hit.closesAt   || '18:00'
    ),
  }));
}

const PER_PAGE = 12;

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

interface BarbersClientProps {
  initialBarbers?: BarberCard[];
}

export default function BarbersClient({ initialBarbers }: BarbersClientProps = {}) {
  const router = useRouter();
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  // country = ISO code (e.g. "ES") to match barberProfiles storage format.
  // countryDisplay = full name for the UI badge (e.g. "Spain").
  const [activeFilter, setActiveFilter] = useState<{ city: string; country: string; countryDisplay?: string } | null>(null);
  const [geoCity, setGeoCity] = useState('');
  const [geoCountry, setGeoCountry] = useState('');
  const [geoApplied, setGeoApplied] = useState(false);
  const [csc, setCsc] = useState<any>(null);

  useEffect(() => { import('country-state-city').then(m => setCsc(m)); }, []);

  // Auto-detect user location and pre-populate filters
  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const city =
            data.address?.city ||
            data.address?.town ||
            data.address?.village ||
            data.address?.county || '';
          const country = data.address?.country || '';
          if (city && country) {
            setGeoCity(city);
            setGeoCountry(country);
            // Only auto-apply if user hasn't already set filters manually
            const { Country: CountryLib } = await import('country-state-city');
            const found = CountryLib.getAllCountries().find(
              (c: any) => c.name.toLowerCase() === country.toLowerCase()
            );
            if (found) {
              setCountryCode(found.isoCode);
              setCountryName(found.name);
              setSelectedCity(city);
              // Use ISO code for filter (matches barberProfiles.country format)
              setActiveFilter({ city, country: found.isoCode, countryDisplay: found.name });
              setGeoApplied(true);
            }
          }
        } catch {
          // Silent fail — geolocation reverse-geocode is best-effort
        }
      },
      () => { /* User denied or unavailable — silent fail */ },
      { timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  // Use server-provided initialBarbers if available, otherwise fetch client-side.
  const { data: allBarbers = [], isLoading, refetch } = useQuery({
    queryKey: ['barbersListV2'],
    queryFn: fetchBarbers,
    // If server already supplied barbers, use them as initial data (no fetch on load).
    // If server returned empty (e.g. Admin SDK not configured), fetch client-side.
    initialData: initialBarbers && initialBarbers.length > 0 ? initialBarbers : undefined,
    staleTime: 0,               // Always treat as stale — rely on 2-min interval
    refetchOnWindowFocus: true,  // Refetch when user returns to tab
  });

  // 2-minute background refresh: new barbers appear within 2 minutes of going live.
  // Avoids onSnapshot (which would open N listeners for N barbers).
  useEffect(() => {
    const interval = setInterval(() => { refetch(); }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, [refetch]);
  const [nameSearch, setNameSearch] = useState('');
  const debouncedNameSearch = useDebounce(nameSearch, 300);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const countries = useMemo(() => csc ? csc.Country.getAllCountries() : [], [csc]);
  const cities = useMemo(() => {
    if (!csc || !countryCode) return [];
    return csc.City.getCitiesOfCountry(countryCode) ?? [];
  }, [csc, countryCode]);

  const filtered = useMemo(() => {
    let list = [...allBarbers];

    if (activeFilter) {
      list = list.filter(b => {
        // City: skip city filter when not selected; bi-directional partial match otherwise
        const cityMatch = !activeFilter.city || locationsMatch(b.city, activeFilter.city);
        // Country: exact ISO-code comparison ("ES" === "ES")
        const countryMatch =
          !activeFilter.country ||
          b.country.toLowerCase() === activeFilter.country.toLowerCase();
        return cityMatch && countryMatch;
      });
    }

    if (debouncedNameSearch.trim()) {
      const q = debouncedNameSearch.trim().toLowerCase();
      list = list.filter(b =>
        `${b.firstName} ${b.lastName}`.toLowerCase().includes(q) ||
        b.barberCode.toLowerCase().includes(q)
      );
    }

    return [
      ...fisherYates(list.filter(b => b.isOpenNow)),
      ...fisherYates(list.filter(b => !b.isOpenNow)),
    ];
  }, [allBarbers, activeFilter, debouncedNameSearch]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = () => {
    setActiveFilter(
      countryCode || selectedCity
        ? { city: selectedCity, country: countryCode, countryDisplay: countryName }
        : null
    );
    setPage(1);
  };

  const clearAll = () => {
    setActiveFilter(null);
    setSelectedCity('');
    setCountryCode('');
    setCountryName('');
    setNameSearch('');
    setGeoApplied(false);
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
        <p className="text-[#888] font-bold text-lg mb-4">
          Browse barbers by city. Real availability. Book in seconds.
        </p>

        {/* Geolocation banner */}
        {geoApplied && geoCity && (
          <div className="flex items-center gap-2 mb-5 bg-[#111] border border-[#1e1e1e] rounded-full px-4 py-2 w-fit text-sm font-bold text-[#888]">
            <span>📍</span>
            <span>Showing barbers near <span className="text-white">{geoCity}</span></span>
            <button
              onClick={clearAll}
              className="ml-1 text-[#555] hover:text-white transition-colors text-xs"
            >
              Change location ✕
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={countryCode} onChange={e => {
              const c = countries.find((c: any) => c.isoCode === e.target.value);
              setCountryCode(e.target.value);
              setCountryName(c?.name || '');
              setSelectedCity('');
            }}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors"
            >
              <option value="">Choose a country</option>
              {countries.map((c: any) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
            </select>

            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              disabled={!countryCode}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Choose a city</option>
              {cities.map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>

            <button onClick={handleSearch} disabled={false}
              className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
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
                {activeFilter.city
                  ? `${activeFilter.city}, ${activeFilter.countryDisplay || activeFilter.country}`
                  : activeFilter.countryDisplay || activeFilter.country}
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
              {activeFilter
                ? activeFilter.city
                  ? `No barbers in ${activeFilter.city} yet`
                  : `No barbers in ${activeFilter.countryDisplay || activeFilter.country} yet`
                : 'No barbers found'}
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
                    prefetch={false}
                    onMouseEnter={() => router.prefetch(`/barber/${b.id}`)}
                    className="bg-[#141414] border border-[#222] rounded-[12px] p-[14px] cursor-pointer flex flex-col">

                    <div className="flex items-start gap-[10px]">
                      <div className="relative w-11 h-11 rounded-[10px] overflow-hidden bg-[#E8491D] shrink-0 flex items-center justify-center">
                        {photo ? (
                          <Image src={photo} alt={name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="text-[20px] font-black text-white leading-none">{name[0]?.toUpperCase()}</span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-extrabold text-[13px] text-white truncate">{name}</span>
                          <span className="text-[10px] text-[#555] font-semibold whitespace-nowrap shrink-0">New ✨</span>
                        </div>
                        {b.city && (
                          <div className="text-[11px] text-[#666] mt-[3px]">📍 {b.city}</div>
                        )}
                      </div>
                    </div>

                    <div className="h-px bg-[#1e1e1e] my-[10px]" />

                    {b.hasSchedule && b.openLabel && (
                      <div className={`text-[10px] font-bold mb-[8px] ${b.openColor}`}>
                        {b.openLabel}
                      </div>
                    )}

                    {b.languages.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap mb-[10px]">
                        {displayLangs.map((lang: string, i: number) => (
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
