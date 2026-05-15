'use client';

import {
  collection, query, where, getDocs, doc, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { getOpenStatus, getLocalDateString, getLocalHourString, getTimezoneFromLocation } from '@/lib/schedule-utils';
import LandingPageClient from './LandingPageClient';

// ─── data fetchers (client-side) ─────────────────────────────────────────────

async function fetchFeaturedBarbers() {
  try {
    const snap = await getDocs(query(
      collection(db, 'barberProfiles'),
      where('isLive', '==', true),
      where('isSolo', '==', true),
    ));
    const profiles = snap.docs
      .map(d => ({ id: d.id, ...d.data() } as any))
      .filter((p: any) => !p.isDeleted);
    if (profiles.length === 0) return [];

    const schedSnaps = await Promise.all(
      profiles.map((p: any) => getDoc(doc(db, 'schedules', `${p.id}_shard_0`)))
    );

    const withStatus = profiles.map((p: any, i: number) => {
      const sched = schedSnaps[i].exists() ? (schedSnaps[i].data() as any) : null;
      const status = getOpenStatus(sched?.availableSlots, p.city, p.country, p.id);
      const tz = getTimezoneFromLocation(p.city, p.country);
      const todayDate = getLocalDateString(tz);
      const nowStr = getLocalHourString(tz);
      const slots: string[] = sched?.availableSlots?.[todayDate] ?? [];
      const nextSlots = slots.filter((s: string) => s >= nowStr).slice(0, 2);
      return { ...p, isOpenNow: status.isOpen, nextSlots };
    });

    // Featured barbers always show first; then open, then closed
    const featuredOpen = withStatus.filter((b: any) => b.isFeatured && b.isOpenNow);
    const featuredClosed = withStatus.filter((b: any) => b.isFeatured && !b.isOpenNow);
    const groupA = withStatus.filter((b: any) => !b.isFeatured && b.isOpenNow);
    const groupB = withStatus.filter((b: any) => !b.isFeatured && !b.isOpenNow);
    for (let i = groupA.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [groupA[i], groupA[j]] = [groupA[j], groupA[i]];
    }
    for (let i = groupB.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [groupB[i], groupB[j]] = [groupB[j], groupB[i]];
    }
    const prioritized = [...featuredOpen, ...featuredClosed, ...groupA, ...groupB];
    const selected = prioritized.slice(0, 3);

    const selectedIds = selected.map((p: any) => p.id);
    const [userSnaps, servicesSnap] = await Promise.all([
      Promise.all(selectedIds.map(id => getDoc(doc(db, 'users', id)))),
      selectedIds.length > 0
        ? getDocs(query(
            collection(db, 'services'),
            where('providerId', 'in', selectedIds.slice(0, 10)),
            where('providerType', '==', 'barber'),
            where('isActive', '==', true),
          ))
        : Promise.resolve({ docs: [] as any[] }),
    ]);

    const servicesPriceMap = new Map<string, number[]>();
    servicesSnap.docs.forEach((d: any) => {
      const data = d.data();
      const price = Number(data.price) || 0;
      if (price > 0) {
        const arr = servicesPriceMap.get(data.providerId) || [];
        arr.push(price);
        servicesPriceMap.set(data.providerId, arr);
      }
    });

    return selected.map((p: any, i: number) => {
      const user = userSnaps[i].exists() ? (userSnaps[i].data() as any) : {};
      const prices = servicesPriceMap.get(p.id) || [];
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

// ─── page component ───────────────────────────────────────────────────────────

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

  return (
    <LandingPageClient
      featuredBarbers={featuredBarbers}
      citiesData={citiesData}
    />
  );
}
