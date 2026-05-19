'use client';

import {
  collection, query, where, getDocs, doc, getDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useQuery } from '@tanstack/react-query';
import { getOpenStatus, getLocalDateString, getLocalHourString, getTimezoneFromLocation, getScheduleDocId } from '@/lib/schedule-utils';
import LandingPageClient from './LandingPageClient';
import { countries } from 'countries-list';

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

function isoToFlag(iso: string): string {
  return Array.from(iso.toUpperCase())
    .map(c => String.fromCodePoint((c.codePointAt(0) as number) + 127397))
    .join('');
}

function getCountryStats(barbers: any[], shops: any[]): { capital: string; flag: string; barberCount: number; shopCount: number; isoCode: string }[] {
  const countryMap: Record<string, { capital: string; flag: string; barberCount: number; shopCount: number; isoCode: string }> = {};

  barbers.forEach(barber => {
    const isoCode = (barber.country || '').trim().toUpperCase();
    if (!isoCode || isoCode.length !== 2) return;
    const countryData = countries[isoCode as keyof typeof countries];
    if (!countryData?.capital) return;
    if (!countryMap[isoCode]) {
      countryMap[isoCode] = { capital: countryData.capital, flag: isoToFlag(isoCode), barberCount: 0, shopCount: 0, isoCode };
    }
    countryMap[isoCode].barberCount++;
  });

  shops.forEach(shop => {
    const shopCountry = (shop.address?.country || shop.country || '').trim();
    if (!shopCountry) return;
    let isoCode = '';
    if (shopCountry.length === 2) {
      isoCode = shopCountry.toUpperCase();
    } else {
      const found = Object.entries(countries).find(([, data]) =>
        data.name.toLowerCase() === shopCountry.toLowerCase()
      );
      if (found) isoCode = found[0];
    }
    if (!isoCode) return;
    const countryData = countries[isoCode as keyof typeof countries];
    if (!countryData?.capital) return;
    if (!countryMap[isoCode]) {
      countryMap[isoCode] = { capital: countryData.capital, flag: isoToFlag(isoCode), barberCount: 0, shopCount: 0, isoCode };
    }
    countryMap[isoCode].shopCount++;
  });

  return Object.values(countryMap)
    .filter(c => c.barberCount > 0)
    .sort((a, b) => b.barberCount - a.barberCount);
}

async function fetchCitiesData(): Promise<{ capital: string; flag: string; barberCount: number; shopCount: number; isoCode: string }[]> {
  try {
    const [shopsSnap, barbersSnap] = await Promise.all([
      getDocs(query(collection(db, 'barbershops'), where('status', '==', 'active'))),
      getDocs(query(collection(db, 'barberProfiles'), where('isLive', '==', true))),
    ]);
    const barbers = barbersSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    const shops = shopsSnap.docs.map(d => ({ id: d.id, ...d.data() } as any));
    return barbers.length > 0 ? getCountryStats(barbers, shops) : [];
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
    queryKey: ['landing_countries_v2'],
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
