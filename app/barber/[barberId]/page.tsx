// Server Component — ISR with 60-second revalidation
import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import BarberProfileClient, { type BarberProfileInitialData } from './BarberProfileClient';

export const revalidate = 60;

/** Pre-build the top 20 rated barbers at deploy time for instant load. */
export async function generateStaticParams() {
  try {
    const snap = await adminDb
      .collection('barberProfiles')
      .where('isLive', '==', true)
      .orderBy('rating', 'desc')
      .limit(20)
      .get();
    return snap.docs.map(doc => ({ barberId: doc.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ barberId: string }>;
}) {
  try {
    const { barberId } = await params;
    const [profileDoc, userDoc] = await Promise.all([
      adminDb.collection('barberProfiles').doc(barberId).get(),
      adminDb.collection('users').doc(barberId).get(),
    ]);

    if (!profileDoc.exists) return { title: 'Barber not found' };

    const p = profileDoc.data() || {};
    const u = userDoc.data() || {};
    const name = `${(u as any).firstName || ''} ${(u as any).lastName || ''}`.trim() || 'Barber';
    const city = (u as any).city || '';
    const spec = ((p as any).specialties || [])[0] || 'Barber';

    return {
      title: name,
      description: `Book ${name} in ${city}. ${spec}. Real availability. Book instantly on titeZMe.`,
      openGraph: {
        title: `${name} — titeZMe`,
        description: `Book ${name} in ${city}. ${spec}.`,
        images: (p as any).profilePhotoUrl ? [(p as any).profilePhotoUrl] : ['/wordmark.png'],
      },
    };
  } catch {
    return { title: 'Barber Profile' };
  }
}

export default async function BarberProfilePage({
  params,
}: {
  params: Promise<{ barberId: string }>;
}) {
  const { barberId } = await params;

  try {
    const [profileDoc, userDoc, scheduleDoc] = await Promise.all([
      adminDb.collection('barberProfiles').doc(barberId).get(),
      adminDb.collection('users').doc(barberId).get(),
      adminDb.collection('schedules').doc(`${barberId}_shard_0`).get(),
    ]);

    if (!profileDoc.exists) {
      notFound();
    }

    const profileData = profileDoc.data() || {};
    const userData = userDoc.exists ? userDoc.data() || {} : {};

    // Fetch shop if barber belongs to one
    let shopData: any = null;
    if ((profileData as any).shopId) {
      const shopDoc = await adminDb.collection('barbershops').doc((profileData as any).shopId).get();
      if (shopDoc.exists) shopData = { id: shopDoc.id, ...shopDoc.data() };
    }

    // Fetch services + reviews in parallel
    const [servicesSnap, reviewsSnap] = await Promise.all([
      adminDb.collection('services')
        .where('providerId', '==', barberId)
        .where('isActive', '==', true)
        .get(),
      adminDb.collection('reviews')
        .where('providerId', '==', barberId)
        .orderBy('createdAt', 'desc')
        .limit(20)
        .get(),
    ]);

    const services = servicesSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // Enrich reviews with client names server-side
    const reviews = await Promise.all(
      reviewsSnap.docs.map(async d => {
        const rev: any = { id: d.id, ...d.data() };
        if (rev.clientId) {
          try {
            const clientDoc = await adminDb.collection('users').doc(rev.clientId).get();
            if (clientDoc.exists) rev.user = clientDoc.data();
          } catch {
            // Non-critical
          }
        }
        return rev;
      })
    );

    const scheduleData = scheduleDoc.exists
      ? (scheduleDoc.data() as { availableSlots?: Record<string, string[]> })
      : null;

    const initialData: BarberProfileInitialData = {
      profile: { id: barberId, ...profileData } as any,
      userProfile: userData as any,
      shop: shopData,
      services: services as any[],
      reviews: reviews as any[],
      schedule: scheduleData,
    };

    return <BarberProfileClient barberId={barberId} initialData={initialData} />;
  } catch (err) {
    console.error('BarberProfilePage server error:', err);
    // Fall back to client-side fetching on error
    return <BarberProfileClient barberId={barberId} />;
  }
}
