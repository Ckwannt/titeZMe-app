'use client';

import {
  collection, query, where, getDocs, doc, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { getOpenStatus, getLocalDateString, getLocalHourString, getTimezoneFromLocation, getScheduleDocId } from '@/lib/schedule-utils';
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
      profiles.map((p: any) => getDoc(doc(db, 'schedules', getScheduleDocId(p.id))))
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

const COUNTRY_CAPITALS: Record<string, { capital: string; flag: string }> = {
  'spain': { capital: 'Madrid', flag: '🇪🇸' },
  'españa': { capital: 'Madrid', flag: '🇪🇸' },
  'france': { capital: 'Paris', flag: '🇫🇷' },
  'morocco': { capital: 'Rabat', flag: '🇲🇦' },
  'maroc': { capital: 'Rabat', flag: '🇲🇦' },
  'algeria': { capital: 'Algiers', flag: '🇩🇿' },
  'algérie': { capital: 'Algiers', flag: '🇩🇿' },
  'tunisia': { capital: 'Tunis', flag: '🇹🇳' },
  'tunisie': { capital: 'Tunis', flag: '🇹🇳' },
  'united kingdom': { capital: 'London', flag: '🇬🇧' },
  'uk': { capital: 'London', flag: '🇬🇧' },
  'england': { capital: 'London', flag: '🇬🇧' },
  'netherlands': { capital: 'Amsterdam', flag: '🇳🇱' },
  'belgium': { capital: 'Brussels', flag: '🇧🇪' },
  'belgique': { capital: 'Brussels', flag: '🇧🇪' },
  'germany': { capital: 'Berlin', flag: '🇩🇪' },
  'deutschland': { capital: 'Berlin', flag: '🇩🇪' },
  'uae': { capital: 'Abu Dhabi', flag: '🇦🇪' },
  'united arab emirates': { capital: 'Abu Dhabi', flag: '🇦🇪' },
  'saudi arabia': { capital: 'Riyadh', flag: '🇸🇦' },
  'italy': { capital: 'Rome', flag: '🇮🇹' },
  'portugal': { capital: 'Lisbon', flag: '🇵🇹' },
  'sweden': { capital: 'Stockholm', flag: '🇸🇪' },
  'canada': { capital: 'Ottawa', flag: '🇨🇦' },
  'usa': { capital: 'Washington DC', flag: '🇺🇸' },
  'united states': { capital: 'Washington DC', flag: '🇺🇸' },
};

function getCountryStats(barbers: any[], shops: any[]): { capital: string; flag: string; barberCount: number; shopCount: number }[] {
  const countryMap: Record<string, { capital: string; flag: string; barberCount: number; shopCount: number }> = {};

  barbers.forEach(barber => {
    const country = (barber.country || '').toLowerCase().trim();
    if (!country) return;
    const mapping = COUNTRY_CAPITALS[country];
    if (!mapping) return;
    const key = mapping.capital;
    if (!countryMap[key]) {
      countryMap[key] = { capital: mapping.capital, flag: mapping.flag, barberCount: 0, shopCount: 0 };
    }
    countryMap[key].barberCount++;
  });

  shops.forEach(shop => {
    const country = (shop.address?.country || shop.country || '').toLowerCase().trim();
    if (!country) return;
    const mapping = COUNTRY_CAPITALS[country];
    if (!mapping) return;
    const key = mapping.capital;
    if (!countryMap[key]) {
      countryMap[key] = { capital: mapping.capital, flag: mapping.flag, barberCount: 0, shopCount: 0 };
    }
    countryMap[key].shopCount++;
  });

  return Object.values(countryMap)
    .filter(c => c.barberCount > 0)
    .sort((a, b) => b.barberCount - a.barberCount);
}

async function fetchCitiesData(): Promise<{ capital: string; flag: string; barberCount: number; shopCount: number }[]> {
  try {
    const [shopsSnap, barbersSnap] = await Promise.all([
      getDocs(query(collection(db, 'barbershops'), where('status', '==', 'active'))),
      getDocs(query(collection(db, 'barberProfiles'), where('isLive', '==', true))),
    ]);
    const barbers = barbersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    const shops = shopsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    return getCountryStats(barbers, shops);
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

  const { data: countryStats = [] } = useQuery({
    queryKey: ['landing_countries_v1'],
    queryFn: fetchCitiesData,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <LandingPageClient
      featuredBarbers={featuredBarbers}
      countryStats={countryStats}
    />
  );
}
