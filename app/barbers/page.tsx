'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Country, City } from 'country-state-city';

// ─── types ───────────────────────────────────────────────────────────────────

type BarberCard = {
  id: string;
  profile: {
    city?: string;
    rating?: number;
    reviewCount?: number;
    specialties?: string[];
    languages?: string[];
    profilePhotoUrl?: string;
    currency?: string;
  };
  user: {
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    city?: string;
    country?: string;
  };
  schedule: { availableSlots?: Record<string, string[]> } | null;
  minPrice: number | null;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function getOpenBadge(schedule: BarberCard['schedule']) {
  if (!schedule?.availableSlots) return null;
  const today = new Date().toISOString().split('T')[0];
  const slots = schedule.availableSlots[today] ?? [];
  if (slots.length === 0) return { label: 'Closed today', color: 'text-[#ef4444]', dot: 'bg-[#ef4444]' };
  const nowHour = new Date().getHours();
  const nowStr = `${String(nowHour).padStart(2, '0')}:00`;
  if (slots.includes(nowStr)) return { label: 'Open now', color: 'text-[#22c55e]', dot: 'bg-[#22c55e]' };
  if (nowHour < parseInt(slots[0])) return { label: `Opens ${slots[0]}`, color: 'text-[#f59e0b]', dot: 'bg-[#f59e0b]' };
  return { label: 'Closed today', color: 'text-[#ef4444]', dot: 'bg-[#ef4444]' };
}

// ─── component ───────────────────────────────────────────────────────────────

export default function BarbersPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeFilter, setActiveFilter] = useState<{ city: string; country: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Live barber profiles via onSnapshot (real-time)
  const [liveProfiles, setLiveProfiles] = useState<{ id: string; data: any }[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    // NOTE: isOnboarded is stored in the `users` collection, NOT in barberProfiles.
    // The query only checks fields that exist in barberProfiles: isLive and isSolo.
    const q = query(
      collection(db, 'barberProfiles'),
      where('isLive', '==', true),
      where('isSolo', '==', true),
      orderBy('rating', 'desc'),
      limit(activeFilter?.city ? 100 : 20),
    );
    const unsub = onSnapshot(q, snap => {
      let docs = snap.docs;
      if (activeFilter?.city) {
        docs = docs.filter(d =>
          (d.data().city ?? '').toLowerCase() === activeFilter.city.toLowerCase()
        );
      }
      setLiveProfiles(docs.map(d => ({ id: d.id, data: d.data() })));
      setListLoading(false);
    });
    return () => unsub();
  }, [activeFilter?.city]);

  // Supplementary data (user names/photos, schedules, min prices) — cached via React Query
  const barberIds = liveProfiles.map(b => b.id);

  const { data: suppData, isLoading: suppLoading } = useQuery({
    queryKey: ['barbersSuppData', ...barberIds],
    queryFn: async () => {
      if (barberIds.length === 0) return {} as Record<string, { user: any; schedule: any; minPrice: number | null }>;
      const [userSnaps, scheduleSnaps, serviceSnaps] = await Promise.all([
        Promise.all(barberIds.map(id => getDoc(doc(db, 'users', id)))),
        Promise.all(barberIds.map(id => getDoc(doc(db, 'schedules', `${id}_shard_0`)))),
        Promise.all(barberIds.map(id =>
          getDocs(query(collection(db, 'services'), where('providerId', '==', id), where('isActive', '==', true)))
        )),
      ]);
      const result: Record<string, { user: any; schedule: any; minPrice: number | null }> = {};
      barberIds.forEach((id, i) => {
        const barberServices = serviceSnaps[i].docs
          .map(s => s.data() as any)
          .filter(s => s.providerType === 'barber');
        const prices = barberServices.map((s: any) => s.price || 0).filter((p: number) => p > 0);
        result[id] = {
          user: userSnaps[i].exists() ? userSnaps[i].data() : {},
          schedule: scheduleSnaps[i].exists() ? scheduleSnaps[i].data() : null,
          minPrice: prices.length > 0 ? Math.min(...prices) : null,
        };
      });
      return result;
    },
    staleTime: 5 * 60 * 1000,
    enabled: barberIds.length > 0,
  });

  const isLoading = listLoading || (barberIds.length > 0 && suppLoading);

  const barbers: BarberCard[] = liveProfiles.map(b => ({
    id: b.id,
    profile: b.data as BarberCard['profile'],
    user: (suppData?.[b.id]?.user ?? {}) as BarberCard['user'],
    schedule: (suppData?.[b.id]?.schedule ?? null) as BarberCard['schedule'],
    minPrice: suppData?.[b.id]?.minPrice ?? null,
  }));

  const countries = Country.getAllCountries();
  const cities = selectedCountryCode ? (City.getCitiesOfCountry(selectedCountryCode) ?? []) : [];

  const handleSearch = () => {
    if (selectedCountryName && selectedCity) {
      setActiveFilter({ city: selectedCity, country: selectedCountryName });
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.origin + '/barbers');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2">Find your barber</h1>
        <p className="text-[#888] font-bold text-lg mb-8">
          Browse barbers by city. Real availability. Book in seconds.
        </p>

        {/* Search bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <select
            value={selectedCountryCode}
            onChange={e => {
              const opt = countries.find(c => c.isoCode === e.target.value);
              setSelectedCountryCode(e.target.value);
              setSelectedCountryName(opt?.name ?? '');
              setSelectedCity('');
            }}
            className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors"
          >
            <option value="">Choose a country</option>
            {countries.map(c => (
              <option key={c.isoCode} value={c.isoCode}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedCity}
            onChange={e => setSelectedCity(e.target.value)}
            disabled={!selectedCountryCode}
            className="flex-1 bg-[#111] border border-[#2a2a2a] text-white rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-brand-yellow transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <option value="">Choose a city</option>
            {cities.map(c => (
              <option key={c.name} value={c.name}>{c.name}</option>
            ))}
          </select>

          <button
            onClick={handleSearch}
            disabled={!selectedCity}
            className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-xl text-sm hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
          >
            Search barbers →
          </button>
        </div>

        {activeFilter && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm text-[#888]">Results for</span>
            <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold px-3 py-1 rounded-full">
              {activeFilter.city}, {activeFilter.country}
            </span>
            <button
              onClick={() => { setActiveFilter(null); setSelectedCity(''); setSelectedCountryCode(''); setSelectedCountryName(''); }}
              className="text-xs text-[#555] hover:text-white transition-colors"
            >
              Clear ✕
            </button>
          </div>
        )}

        <div className="border-t border-[#1a1a1a] mt-4" />
      </div>

      {/* ── Results ─────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 pb-16">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-2xl h-[240px] animate-pulse" />
            ))}
          </div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">💈</div>
            <h3 className="text-xl font-black mb-2">
              {activeFilter ? `No barbers in ${activeFilter.city} yet` : 'No barbers available'}
            </h3>
            <p className="text-[#555] text-sm mb-6">
              {activeFilter ? 'Know a barber there? Share titeZMe with them.' : 'Check back soon.'}
            </p>
            {activeFilter && (
              <button
                onClick={handleShare}
                className="bg-[#1a1a1a] border border-[#2a2a2a] text-white font-bold px-6 py-3 rounded-full text-sm hover:border-[#444] transition-colors"
              >
                {copied ? '✓ Copied!' : '🔗 Share titeZMe'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {barbers.map(b => {
              const badge = getOpenBadge(b.schedule);
              const currency = b.profile.currency ?? '€';
              const name = `${b.user.firstName ?? ''} ${b.user.lastName ?? ''}`.trim() || 'Barber';
              const city = b.profile.city ?? b.user.city ?? '';
              const country = b.user.country ?? '';
              const photo = b.profile.profilePhotoUrl ?? b.user.photoUrl;
              const specialties = b.profile.specialties ?? [];
              const languages = b.profile.languages ?? [];

              return (
                <Link
                  href={`/barber/${b.id}`}
                  key={b.id}
                  className="group bg-[#111] border border-[#1a1a1a] rounded-2xl p-5 hover:border-[#2a2a2a] transition-all hover:-translate-y-0.5 block"
                >
                  {/* Avatar + info */}
                  <div className="flex items-start gap-3 mb-4">
                    <div className="relative w-14 h-14 rounded-[14px] overflow-hidden shrink-0 border border-[#2a2a2a] bg-[#1a1a1a]">
                      {photo ? (
                        <Image src={photo} alt={name} fill className="object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-black text-xl text-[#0a0a0a] bg-gradient-to-br from-brand-orange to-brand-yellow">
                          {name[0] ?? 'B'}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-white text-[15px] leading-tight truncate group-hover:text-brand-yellow transition-colors">
                        {name}
                      </h3>
                      <div className="text-xs text-[#666] font-bold mt-0.5 truncate">
                        📍 {[city, country].filter(Boolean).join(', ')}
                      </div>
                      {badge && (
                        <div className={`flex items-center gap-1.5 mt-1 ${badge.color}`}>
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`} />
                          <span className="text-[11px] font-bold">{badge.label}</span>
                        </div>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {(b.profile.reviewCount ?? 0) > 0 ? (
                        <>
                          <div className="font-black text-brand-yellow text-sm">
                            ★ {typeof b.profile.rating === 'number' ? b.profile.rating.toFixed(1) : '—'}
                          </div>
                          <div className="text-[10px] text-[#555]">({b.profile.reviewCount})</div>
                        </>
                      ) : (
                        <div className="text-[11px] text-[#555] font-bold">New ✨</div>
                      )}
                    </div>
                  </div>

                  {/* Specialties */}
                  {specialties.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 mb-3">
                      {specialties.slice(0, 2).map(s => (
                        <span key={s} className="bg-brand-yellow/10 text-brand-yellow text-[10px] font-black px-2 py-0.5 rounded-full border border-brand-yellow/20">
                          {s}
                        </span>
                      ))}
                      {specialties.length > 2 && (
                        <span className="text-[10px] text-[#555] font-bold">+{specialties.length - 2} more</span>
                      )}
                    </div>
                  )}

                  {/* Languages */}
                  {languages.length > 0 && (
                    <div className="text-[11px] text-[#555] font-bold mb-3">
                      🌍 {languages.slice(0, 2).join(' · ')}{languages.length > 2 ? ` +${languages.length - 2}` : ''}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[#1a1a1a]">
                    <span className="text-sm font-extrabold text-white">
                      {b.minPrice !== null ? `from ${currency}${b.minPrice}` : 'Prices on request'}
                    </span>
                    <span className="text-xs font-black text-brand-orange group-hover:text-brand-yellow transition-colors">
                      View profile →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
