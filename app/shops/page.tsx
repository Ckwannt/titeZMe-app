'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { collection, query, where, getDocs, doc, getDoc, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { Country, City } from 'country-state-city';

// ─── types ───────────────────────────────────────────────────────────────────

type ShopCard = {
  id: string;
  shop: {
    name?: string;
    address?: { street?: string; number?: string; city?: string; country?: string };
    coverPhotoUrl?: string;
    barbers?: string[];
    createdAt?: number;
  };
  schedule: { availableSlots?: Record<string, string[]> } | null;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

function getOpenBadge(schedule: ShopCard['schedule']) {
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

export default function ShopsPage() {
  const [selectedCountryCode, setSelectedCountryCode] = useState('');
  const [selectedCountryName, setSelectedCountryName] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [activeFilter, setActiveFilter] = useState<{ city: string; country: string } | null>(null);

  // Live shops list via onSnapshot (real-time)
  const [liveShops, setLiveShops] = useState<{ id: string; data: ShopCard['shop'] }[]>([]);
  const [listLoading, setListLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'barbershops'),
      where('status', '==', 'active'),
      limit(activeFilter?.city ? 100 : 20),
    );
    const unsub = onSnapshot(q, snap => {
      let docs = snap.docs;
      if (activeFilter?.city) {
        docs = docs.filter(d =>
          (d.data().address?.city ?? '').toLowerCase() === activeFilter.city.toLowerCase()
        );
      }
      setLiveShops(docs.map(d => ({ id: d.id, data: d.data() as ShopCard['shop'] })));
      setListLoading(false);
    });
    return () => unsub();
  }, [activeFilter?.city]);

  // Supplementary schedule data — cached via React Query, re-fetches when shop list changes
  const shopIds = liveShops.map(s => s.id);

  const { data: scheduleData, isLoading: schedLoading } = useQuery({
    queryKey: ['shopSchedules', ...shopIds],
    queryFn: async () => {
      if (shopIds.length === 0) return {} as Record<string, ShopCard['schedule']>;
      const snaps = await Promise.all(
        shopIds.map(id => getDoc(doc(db, 'schedules', `${id}_shard_0`)))
      );
      const result: Record<string, ShopCard['schedule']> = {};
      shopIds.forEach((id, i) => {
        result[id] = snaps[i].exists()
          ? (snaps[i].data() as { availableSlots?: Record<string, string[]> })
          : null;
      });
      return result;
    },
    staleTime: 5 * 60 * 1000,
    enabled: shopIds.length > 0,
  });

  const isLoading = listLoading || (shopIds.length > 0 && schedLoading);

  const shops: ShopCard[] = liveShops.map(s => ({
    id: s.id,
    shop: s.data,
    schedule: scheduleData?.[s.id] ?? null,
  }));

  const countries = Country.getAllCountries();
  const cities = selectedCountryCode ? (City.getCitiesOfCountry(selectedCountryCode) ?? []) : [];

  const handleSearch = () => {
    if (selectedCountryName && selectedCity) {
      setActiveFilter({ city: selectedCity, country: selectedCountryName });
    }
  };

  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1200px] mx-auto px-6 pt-12 pb-8">
        <h1 className="text-4xl md:text-5xl font-black mb-2">Find a barbershop</h1>
        <p className="text-[#888] font-bold text-lg mb-8">
          Browse barbershops by city. Meet the team. Book your spot.
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
            Search shops →
          </button>
        </div>

        {activeFilter && (
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-sm text-[#888]">Results for</span>
            <span className="bg-[#1a1a1a] border border-[#2a2a2a] text-white text-xs font-bold px-3 py-1 rounded-full">
              {activeFilter.city}, {activeFilter.country}
            </span>
            <button
              onClick={() => { setActiveFilter(null); setSelectedCity(''); setSelectedCountryCode(''); }}
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
              <div key={i} className="bg-[#111] border border-[#1a1a1a] rounded-2xl h-[220px] animate-pulse" />
            ))}
          </div>
        ) : shops.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🏪</div>
            <h3 className="text-xl font-black mb-2">
              {activeFilter ? `No barbershops in ${activeFilter.city} yet` : 'No barbershops available'}
            </h3>
            <p className="text-[#555] text-sm mb-6">
              {activeFilter ? 'Own a shop? Join titeZMe free.' : 'Check back soon.'}
            </p>
            <Link
              href="/signup"
              className="bg-brand-yellow text-[#0a0a0a] font-black px-6 py-3 rounded-full text-sm hover:opacity-90 transition-opacity inline-block"
            >
              Join as a barber →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {shops.map(s => {
              const badge = getOpenBadge(s.schedule);
              const name = s.shop.name ?? 'Barbershop';
              const address = s.shop.address;
              const addressLine = [address?.street, address?.number].filter(Boolean).join(' ');
              const cityLine = [address?.city, address?.country].filter(Boolean).join(', ');
              const barberCount = s.shop.barbers?.length ?? 0;
              const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();

              return (
                <Link
                  href={`/shop/${s.id}`}
                  key={s.id}
                  className="group bg-[#111] border border-[#1a1a1a] rounded-2xl overflow-hidden hover:border-[#2a2a2a] transition-all hover:-translate-y-0.5 block"
                >
                  {/* Cover photo */}
                  <div className="h-[120px] bg-[#1a1a1a] relative overflow-hidden">
                    {s.shop.coverPhotoUrl ? (
                      <Image
                        src={s.shop.coverPhotoUrl}
                        alt={name}
                        fill
                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-black text-3xl text-[#0a0a0a] bg-gradient-to-br from-brand-orange to-brand-yellow">
                        {initials}
                      </div>
                    )}
                    {badge && (
                      <div className="absolute top-3 left-3 bg-[#0a0a0a]/80 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${badge.dot}`} />
                        <span className={`text-[11px] font-bold ${badge.color}`}>{badge.label}</span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-black text-white text-[15px] leading-tight group-hover:text-brand-yellow transition-colors mb-1">
                      {name}
                    </h3>
                    {addressLine && (
                      <div className="text-xs text-[#666] font-bold truncate">📍 {addressLine}</div>
                    )}
                    {cityLine && (
                      <div className="text-xs text-[#444] font-bold truncate mt-0.5">{cityLine}</div>
                    )}

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-[#1a1a1a]">
                      <span className="text-xs font-bold text-[#555]">
                        {barberCount > 0 ? `${barberCount} barber${barberCount !== 1 ? 's' : ''}` : 'New shop ✨'}
                      </span>
                      <span className="text-xs font-black text-brand-orange group-hover:text-brand-yellow transition-colors">
                        View shop →
                      </span>
                    </div>
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
