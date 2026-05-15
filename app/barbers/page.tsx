// Server Component — no 'use client'
import { adminDb } from '@/lib/firebase-admin';
import { getOpenStatus } from '@/lib/schedule-utils';
import BarbersClient from './BarbersClient';

export const metadata = {
  title: 'Find a Barber',
  description: 'Browse top-rated barbers by city. Real availability. Book in seconds on titeZMe.',
};

export type BarberCard = {
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
  openLabel: string;
  openColor: string;
  hasSchedule: boolean;
  minPrice: number | null;
};

export default async function BarbersPage() {
  try {
    const snap = await adminDb
      .collection('barberProfiles')
      .where('isLive', '==', true)
      .where('isSolo', '==', true)
      .limit(200)
      .get();

    // Post-fetch filter for soft-deleted barbers
    const docs = snap.docs.filter(d => !d.data().isDeleted);
    const ids = docs.map(d => d.id);

    if (ids.length === 0) {
      return <BarbersClient initialBarbers={[]} />;
    }

    // Batch fetch users + schedules in parallel
    const [userDocs, scheduleDocs] = await Promise.all([
      Promise.all(ids.map(id => adminDb.collection('users').doc(id).get())),
      Promise.all(ids.map(id => adminDb.collection('schedules').doc(`${id}_shard_0`).get())),
    ]);

    // Batch fetch services with chunked queries (Admin SDK max 30 per 'in')
    const serviceChunkPromises: Promise<FirebaseFirestore.QuerySnapshot>[] = [];
    for (let i = 0; i < ids.length; i += 10) {
      const chunk = ids.slice(i, i + 10);
      serviceChunkPromises.push(
        adminDb.collection('services')
          .where('providerId', 'in', chunk)
          .where('isActive', '==', true)
          .get()
      );
    }
    const serviceResults = await Promise.all(serviceChunkPromises);
    const servicesPriceMap = new Map<string, number[]>();
    serviceResults.forEach(r => {
      r.docs.forEach(d => {
        const data = d.data();
        const price = Number(data.price) || 0;
        if (price > 0) {
          const arr = servicesPriceMap.get(data.providerId) || [];
          arr.push(price);
          servicesPriceMap.set(data.providerId, arr);
        }
      });
    });

    const barbers: BarberCard[] = docs.map((doc, i) => {
      const profile = doc.data();
      const user = userDocs[i].exists ? userDocs[i].data() || {} : {};
      const schedData = scheduleDocs[i].exists ? scheduleDocs[i].data() || {} : null;
      const prices = servicesPriceMap.get(doc.id) || [];
      const city = (profile.city || (user as any).city || '') as string;
      const country = ((user as any).country || '') as string;

      const status = getOpenStatus(
        schedData?.availableSlots as Record<string, string[]> | undefined,
        city,
        country,
        doc.id
      );

      return {
        id: doc.id,
        profilePhotoUrl: (profile.profilePhotoUrl as string) || undefined,
        photoUrl: ((user as any).photoUrl as string) || undefined,
        firstName: ((user as any).firstName as string) || '',
        lastName: ((user as any).lastName as string) || '',
        country,
        city,
        street: '',
        languages: (profile.languages as string[]) || [],
        vibes: ((profile.vibes || profile.vibe) as string[]) || [],
        currency: (profile.currency as string) || 'EUR',
        barberCode: (profile.barberCode as string) || '',
        isOpenNow: status.isOpen,
        openLabel: status.label,
        openColor: status.color,
        hasSchedule: schedData !== null,
        minPrice: prices.length > 0 ? Math.min(...prices) : null,
      };
    });

    // Sort: open first (shuffled), then closed (shuffled)
    const shuffle = <T,>(arr: T[]) => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    };
    const sorted = [
      ...shuffle(barbers.filter(b => b.isOpenNow)),
      ...shuffle(barbers.filter(b => !b.isOpenNow)),
    ];

    return <BarbersClient initialBarbers={sorted} />;
  } catch (err) {
    console.error('BarbersPage server error:', err);
    return <BarbersClient initialBarbers={[]} />;
  }
}
