'use client';

import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
// country-state-city loaded dynamically to avoid bundling 1.8 MB on initial load
import { getOpenStatus, getTimezoneFromLocation, getLocalDateString } from '@/lib/schedule-utils';
import { locationsMatch } from '@/lib/location-utils';
import { useDebounce } from '@/hooks/useDebounce';
import { useAuth } from '@/lib/auth-context';
import { useLang } from '@/lib/i18n/LangContext';
import { fakeShopsUI } from '@/lib/fakeUIData';
import { fakeToShopCard } from '@/lib/fakeUIDataMappers';
import { useShowFakeUIData } from '@/hooks/useShowFakeUIData';

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
  state?: string;
  city: string;
  street: string;
  isOpenNow: boolean;
  openLabel: string;
  openColor: string;
  hasSchedule: boolean;
  minPrice: number | null;
  currency?: string;
  isFeatured?: boolean;
};

// ─── data fetcher ─────────────────────────────────────────────────────────────

async function fetchShops(): Promise<ShopCard[]> {
  const snap = await getDocs(query(
    collection(db, 'businesses'),
    where('status', '==', 'active'),
    limit(100),
  ));
  const shops = snap.docs
    .map(d => ({ id: d.id, ...d.data() } as any))
    .filter((shop: any) => shop.isFake !== true || shop.isVisible !== false);
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

  return shops.map((s: any, i: number) => {
    const sched = scheduleSnaps[i].exists() ? (scheduleSnaps[i].data() as any) : null;
    const shopCity = s.address?.city || '';
    const shopCountry = s.address?.country || '';
    const status = getOpenStatus(sched?.availableSlots, shopCity, shopCountry, s.id);
    const prices = serviceSnaps[i].docs
      .map(d => Number((d.data() as any).price) || 0)
      .filter(n => n > 0);

    return {
      id: s.id,
      name: s.name || '',
      coverPhotoUrl: s.coverPhotoUrl,
      country: shopCountry,
      state: s.address?.state || '',
      city: shopCity,
      street: s.address?.street || '',
      isOpenNow: status.isOpen,
      openLabel: status.label,
      openColor: status.color,
      hasSchedule: sched !== null,
      minPrice: prices.length > 0 ? Math.min(...prices) : null,
      currency: 'EUR',
      isFeatured: Boolean(s.isFeatured),
    };
  });
}

// ─── pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, total, onChange }: {
  page: number; total: number; onChange: (p: number) => void;
}) {
  const { t } = useLang();
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
        {t('buttons.prev')}
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
        {t('buttons.next')}
      </button>
    </div>
  );
}

// ─── component ───────────────────────────────────────────────────────────────

export default function ShopsPage() {
  const router = useRouter();
  const { user, authLoading } = useAuth();
  const { t } = useLang();
  const shouldBlur = !authLoading && !user;
  const showFakes = useShowFakeUIData();
  const [countryCode, setCountryCode] = useState('');
  const [countryName, setCountryName] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeFilter, setActiveFilter] = useState<{ city: string; state: string; country: string } | null>(null);
  const [nameSearch, setNameSearch] = useState('');
  const debouncedNameSearch = useDebounce(nameSearch, 300);
  const [page, setPage] = useState(1);
  const [geoApplied, setGeoApplied] = useState(false);
  const [geoCity, setGeoCity] = useState('');
  const [csc, setCsc] = useState<any>(null);

  useEffect(() => { import('country-state-city').then(m => setCsc(m)); }, []);

  // Geolocation auto-fill — same as /barbers page.
  // Shops store address.country as the full country name ("Spain"), so we use
  // found.name (not isoCode) for the activeFilter.country comparison.
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
            data.address?.municipality ||
            data.address?.village ||
            data.address?.county || '';
          const country = data.address?.country || '';
          if (city && country) {
            const { Country: CountryLib } = await import('country-state-city');
            const found = CountryLib.getAllCountries().find(
              (c: any) => c.name.toLowerCase() === country.toLowerCase()
            );
            if (found) {
              setCountryCode(found.isoCode);
              setCountryName(found.name);
              setSelectedCity(city);
              // Shops store address.country as full country name → compare by name
              setActiveFilter({ city, state: '', country: found.name });
              setGeoCity(city);
              setGeoApplied(true);
            }
          }
        } catch {
          // Silent fail — geolocation is best-effort
        }
      },
      () => { /* User denied — silent fail */ },
      { timeout: 5000, maximumAge: 300000 }
    );
  }, []);

  const countries = useMemo(() => csc ? csc.Country.getAllCountries() : [], [csc]);
  const states = useMemo(() => {
    if (!csc || !countryCode) return [];
    return csc.State.getStatesOfCountry(countryCode) ?? [];
  }, [csc, countryCode]);
  const cities = useMemo(() => {
    if (!csc || !countryCode) return [];
    return csc.City.getCitiesOfCountry(countryCode) ?? [];
  }, [csc, countryCode]);

  const { data: allShops = [], isLoading } = useQuery({
    queryKey: ['shopsListV2'],
    queryFn: fetchShops,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const mergedShops = useMemo<ShopCard[]>(() => {
    const TARGET_TOTAL = 50;
    const visibleFakeCount = showFakes
      ? Math.max(0, TARGET_TOTAL - allShops.length)
      : 0;
    const fakesAsCards: ShopCard[] = fakeShopsUI
      .slice(0, visibleFakeCount)
      .map(fakeToShopCard);
    return [...allShops, ...fakesAsCards];
  }, [allShops, showFakes]);

  const filtered = useMemo(() => {
    let list = [...mergedShops];

    if (activeFilter) {
      list = list.filter(s => {
        // City: skip city filter when not selected; bi-directional partial match otherwise
        const cityMatch = !activeFilter.city || locationsMatch(s.city, activeFilter.city);
        // Country: flexible match — shops store full country name ("Spain")
        const countryMatch =
          !activeFilter.country ||
          locationsMatch(s.country, activeFilter.country);
        // State/Region: exact ISO-code comparison ("CT" === "CT") — controlled list, not free text
        const stateMatch =
          !activeFilter.state ||
          (s.state || '').toLowerCase() === activeFilter.state.toLowerCase();
        return cityMatch && countryMatch && stateMatch;
      });
    }

    if (debouncedNameSearch.trim()) {
      const q = debouncedNameSearch.trim().toLowerCase();
      list = list.filter(s => s.name.toLowerCase().includes(q));
    }

    const featured = list.filter(s => s.isFeatured);
    const nonFeatured = list.filter(s => !s.isFeatured);
    const openNow = fisherYates(nonFeatured.filter(s => s.isOpenNow));
    const closed = fisherYates(nonFeatured.filter(s => !s.isOpenNow));
    return [...featured, ...openNow, ...closed];
  }, [mergedShops, activeFilter, debouncedNameSearch]);

  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = () => {
    setActiveFilter(
      countryName || selectedState || selectedCity
        ? { city: selectedCity, state: selectedState, country: countryName }
        : null
    );
    setPage(1);
  };

  const clearAll = () => {
    setActiveFilter(null);
    setSelectedCity('');
    setSelectedState('');
    setCountryCode('');
    setCountryName('');
    setNameSearch('');
    setGeoApplied(false);
    setGeoCity('');
    setPage(1);
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      <div className="max-w-[1400px] mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2">{t('forms.findYourShop')}</h1>
        <p className="text-[#888] font-bold text-lg mb-8">
          {t('forms.browseShopsCity')}
        </p>

        {/* Geolocation banner */}
        {geoApplied && geoCity && (
          <div className="flex items-center gap-2 mb-5 bg-[#111] border border-[#1e1e1e] rounded-full px-4 py-2 w-fit text-sm font-bold text-[#888]">
            <span>📍</span>
            <span>{t('status.showingShopsNear')} <span className="text-white">{geoCity}</span></span>
            <button
              onClick={clearAll}
              className="ml-1 text-[#555] hover:text-white transition-colors text-xs"
            >
              {t('status.changeLocation')}
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={countryCode}
              onChange={e => {
                const opt = countries.find((c: any) => c.isoCode === e.target.value);
                setCountryCode(e.target.value);
                setCountryName(opt?.name ?? '');
                setSelectedState('');
                setSelectedCity('');
              }}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors"
            >
              <option value="">{t('forms.chooseCountryShops')}</option>
              {countries.map((c: any) => <option key={c.isoCode} value={c.isoCode}>{c.name}</option>)}
            </select>

            <select value={selectedState} onChange={e => setSelectedState(e.target.value)}
              disabled={!countryCode}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">Choose a region</option>
              {states.map((s: any) => <option key={s.isoCode} value={s.isoCode}>{s.name}</option>)}
            </select>

            <select value={selectedCity} onChange={e => setSelectedCity(e.target.value)}
              disabled={!countryCode}
              className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <option value="">{t('forms.chooseCityShops')}</option>
              {cities.map((c: any) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>

            <button onClick={handleSearch} disabled={false}
              className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
              {t('buttons.searchShops')}
            </button>
          </div>

          <input value={nameSearch} onChange={e => { setNameSearch(e.target.value); setPage(1); }}
            placeholder={t('forms.searchByShopName')}
            className="w-full sm:max-w-sm bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors placeholder:text-[#444]"
          />
        </div>

        {(activeFilter || nameSearch) && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {activeFilter && (
              <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold px-3 py-1 rounded-full">
                {activeFilter.city
                  ? `${activeFilter.city}, ${activeFilter.country}`
                  : activeFilter.country}
              </span>
            )}
            {nameSearch && (
              <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold px-3 py-1 rounded-full">
                &quot;{nameSearch}&quot;
              </span>
            )}
            <button onClick={clearAll} className="text-xs text-[#555] hover:text-white transition-colors">
              {t('buttons.clearAll')} ✕
            </button>
          </div>
        )}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 pb-16">
        {/* Divider between search and grid */}
        <div className="h-px bg-[#1e1e1e] mb-5" />

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-[#141414] border border-[#222] rounded-[12px] h-[230px] animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-xl font-black mb-2">
              {activeFilter
                ? activeFilter.city
                  ? t('emptyStates.noShopsCity').replace('{city}', activeFilter.city)
                  : t('emptyStates.noShopsCountry').replace('{country}', activeFilter.country)
                : t('emptyStates.noShopsFound')}
            </h3>
            <p className="text-[#555] text-sm mb-6">
              {activeFilter ? t('emptyStates.ownAShop') : t('emptyStates.checkBackSoon')}
            </p>
            <Link href="/signup"
              className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity inline-block">
              {t('buttons.joinAsBarber')}
            </Link>
          </div>
        ) : (
          <>
            <div className="text-xs font-bold text-[#555] mb-4">
              {filtered.length === 1 ? `1 ${t('status.shopsFound')}` : `${filtered.length} ${t('status.shopsFoundPlural')}`}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full items-stretch">
              {(() => {
                const firstBlurredIndex = paged.findIndex(
                  ss => shouldBlur && !ss.isFeatured
                );
                return paged.map(s => {
                const isFeaturedCard = s.isFeatured === true;
                const applyBlur = shouldBlur && !isFeaturedCard;
                const showOverlay = applyBlur && paged.indexOf(s) === firstBlurredIndex;
                const displayName = s.name || t('misc.shopFallback');
                const initials = displayName.split(' ').slice(0, 2).map((w: string) => w[0]).join('').toUpperCase();

                return (
                  <div key={s.id} className="relative h-full">
                    <div
                      className="h-full"
                      style={{
                        filter: applyBlur ? 'blur(5px)' : 'none',
                        pointerEvents: applyBlur ? 'none' : 'auto',
                        userSelect: applyBlur ? 'none' : 'auto',
                        transition: 'filter 0.2s',
                      }}
                    >
                      <Link href={`/shop/${s.id}`}
                        prefetch={false}
                        onMouseEnter={() => router.prefetch(`/shop/${s.id}`)}
                        className="bg-[#141414] border border-[#222] rounded-[12px] overflow-hidden cursor-pointer flex flex-col h-full">

                        {/* TOP — Cover / gradient area */}
                        <div className="relative h-[140px] flex items-center justify-center shrink-0"
                          style={{ background: 'linear-gradient(135deg, #E8491D, #F5C518)' }}>
                          {s.coverPhotoUrl ? (
                            <Image src={s.coverPhotoUrl} alt={displayName} fill className="object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <span className="text-[40px] font-black" style={{ color: 'rgba(0,0,0,0.3)' }}>
                              {initials}
                            </span>
                          )}

                          {/* Status badge */}
                          {s.hasSchedule && (
                            <span className={`absolute top-[10px] left-[10px] text-[10px] font-extrabold px-[10px] py-[3px] rounded-full ${
                              s.isOpenNow
                                ? 'bg-[#0f2010] text-[#22C55E]'
                                : 'bg-[#1a0808] text-[#EF4444]'
                            }`}>
                              ● {s.isOpenNow ? t('status.openNow') : t('status.closed')}
                            </span>
                          )}
                        </div>

                        {/* BOTTOM — Info area */}
                        <div className="flex flex-col flex-1 px-[14px] py-[12px]">
                          {/* Shop name */}
                          <div className="text-[13px] font-extrabold text-white mb-1 truncate">
                            {displayName}
                          </div>

                          {/* Street address */}
                          {s.street && (
                            <div className="text-[11px] text-[#666] mb-0.5 truncate">
                              📍 {s.street}
                            </div>
                          )}

                          {/* City, Country */}
                          {(s.city || s.country) && (
                            <div className="text-[11px] text-[#555] mb-[10px] truncate">
                              {[s.city, s.country].filter(Boolean).join(', ')}
                            </div>
                          )}

                          {/* Bottom row */}
                          <div className="flex justify-between items-center mt-auto">
                            <span className="text-[11px] text-[#555]">{t('status.newShopBadge')}</span>
                            <span className="text-[12px] font-bold text-[#E8491D]">{t('buttons.viewShop')}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                    {showOverlay && (
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 10,
                        zIndex: 10,
                        borderRadius: 12,
                        background: 'rgba(10,10,10,0.5)',
                        padding: 16,
                      }}>
                        <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', textAlign: 'center' }}>
                          {t('headings.signUpToSeeShops')}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
                          <a href="/signup" style={{
                            background: '#F5C518', color: '#0a0a0a', fontWeight: 900, fontSize: 12,
                            padding: '8px 16px', borderRadius: 8, textDecoration: 'none',
                          }}>{t('buttons.createAccount')}</a>
                          <a href="/login" style={{
                            background: '#1a1a1a', color: '#fff', fontWeight: 900, fontSize: 12,
                            padding: '8px 16px', borderRadius: 8, border: '1px solid #333', textDecoration: 'none',
                          }}>{t('nav.login')}</a>
                        </div>
                      </div>
                    )}
                  </div>
                );
                });
              })()}
            </div>
            <Pagination page={page} total={filtered.length} onChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
