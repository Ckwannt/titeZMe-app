// Server Component — revalidates every 5 minutes
import { adminDb } from '@/lib/firebase-admin';
import { getOpenStatus, getLocalDateString, getLocalHourString, getTimezoneFromLocation } from '@/lib/schedule-utils';
import LandingPageClient from './LandingPageClient';

export const revalidate = 300;

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

export default async function LandingPage() {
  let featuredBarbers: any[] = [];
  let citiesData: { city: string; barbers: number; shops: number }[] = [];

  try {
    // Fetch all live barbers + active shops in parallel
    const [barbersSnap, shopsSnap] = await Promise.all([
      adminDb.collection('barberProfiles')
        .where('isLive', '==', true)
        .where('isSolo', '==', true)
        .get(),
      adminDb.collection('barbershops')
        .where('status', '==', 'active')
        .get(),
    ]);

    // Build cities data
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
    const allCities = new Set([...Object.keys(bc), ...Object.keys(sc)]);
    citiesData = Array.from(allCities)
      .map(city => ({ city, barbers: bc[city] || 0, shops: sc[city] || 0 }))
      .sort((a, b) => (b.barbers + b.shops) - (a.barbers + a.shops))
      .slice(0, 8);

    // Pick featured barbers: prefer open ones
    const allDocs = barbersSnap.docs.filter(d => !d.data().isDeleted);
    if (allDocs.length > 0) {
      // Shuffle and pick candidates
      const shuffled = [...allDocs].sort(() => Math.random() - 0.5).slice(0, 12);
      const candidateIds = shuffled.map(d => d.id);

      // Batch fetch schedules + users + services
      const [scheduleDocs, userDocs] = await Promise.all([
        Promise.all(candidateIds.map(id => adminDb.collection('schedules').doc(`${id}_shard_0`).get())),
        Promise.all(candidateIds.map(id => adminDb.collection('users').doc(id).get())),
      ]);

      // Build candidates with open status
      const candidates = shuffled.map((doc, i) => {
        const p = doc.data() as any;
        const u = (userDocs[i].exists ? userDocs[i].data() : {}) as any;
        const sched = scheduleDocs[i].exists ? scheduleDocs[i].data() as any : null;
        const tz = getTimezoneFromLocation(p.city || u.city, u.country);
        const todayDate = getLocalDateString(tz);
        const nowStr = getLocalHourString(tz);
        const status = getOpenStatus(sched?.availableSlots, p.city || u.city, u.country, doc.id);
        const slots: string[] = sched?.availableSlots?.[todayDate] ?? [];
        const nextSlots = slots.filter((s: string) => s >= nowStr).slice(0, 2);

        return {
          id: doc.id,
          ...p,
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          userCity: u.city || p.city || '',
          photoUrl: p.profilePhotoUrl || u.photoUrl || null,
          isOpenNow: status.isOpen,
          nextSlots,
          minPrice: null as number | null,
          maxPrice: null as number | null,
        };
      });

      // Sort open first
      const openCandidates = candidates.filter(c => c.isOpenNow);
      const closedCandidates = candidates.filter(c => !c.isOpenNow);
      const selected = [
        ...openCandidates.slice(0, 3),
        ...closedCandidates.slice(0, Math.max(0, 3 - openCandidates.length)),
      ];

      // Fetch services for selected
      const selectedIds = selected.map(c => c.id);
      if (selectedIds.length > 0) {
        try {
          const servicesSnap = await adminDb.collection('services')
            .where('providerId', 'in', selectedIds.slice(0, 10))
            .where('isActive', '==', true)
            .get();
          const priceMap = new Map<string, number[]>();
          servicesSnap.docs.forEach(d => {
            const data = d.data() as any;
            const price = Number(data.price) || 0;
            if (price > 0) {
              const arr = priceMap.get(data.providerId) || [];
              arr.push(price);
              priceMap.set(data.providerId, arr);
            }
          });
          selected.forEach(c => {
            const prices = priceMap.get(c.id) || [];
            c.minPrice = prices.length > 0 ? Math.min(...prices) : null;
            c.maxPrice = prices.length > 0 ? Math.max(...prices) : null;
          });
        } catch {
          // Non-critical — services just won't show prices
        }
      }

      featuredBarbers = selected;
    }
  } catch (err) {
    console.error('LandingPage server error:', err);
    // Falls through with empty arrays — client will show static content
  }

  return (
    <LandingPageClient
      featuredBarbers={featuredBarbers}
      citiesData={citiesData}
    />
  );
}
