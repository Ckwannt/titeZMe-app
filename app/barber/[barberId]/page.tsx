// Server Component — ISR with 60-second revalidation
import { notFound } from 'next/navigation';
import { adminDb } from '@/lib/firebase-admin';
import BarberProfileClient, { type BarberProfileInitialData } from './BarberProfileClient';
import { getScheduleDocId } from '@/lib/schedule-utils';

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
    const name = `${(p as any).firstName || (u as any).firstName || ''} ${(p as any).lastName || (u as any).lastName || ''}`.trim() || 'Barber';
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
      adminDb.collection('schedules').doc(getScheduleDocId(barberId)).get(),
    ]);

    if (!profileDoc.exists) {
      notFound();
    }

    const profileData = profileDoc.data() || {};
    const userData = userDoc.exists ? userDoc.data() || {} : {};
    const pData = profileData as any;
    const uData = userData as any;

    // Heal: if barberProfiles is missing public display fields, copy them
    // from users doc automatically. Fixes existing barbers who completed
    // onboarding before the security migration.
    if (!pData.firstName && uData.firstName) {
      const healData: Record<string, any> = {};
      if (!pData.firstName && uData.firstName) healData.firstName = uData.firstName;
      if (!pData.lastName  && uData.lastName)  healData.lastName  = uData.lastName;
      if (!pData.photoUrl  && uData.photoUrl)  healData.photoUrl  = uData.photoUrl;
      if (!pData.createdAt && uData.createdAt) healData.createdAt = uData.createdAt;
      if (!pData.city      && uData.city)      healData.city      = uData.city;
      if (!pData.country   && uData.country)   healData.country   = uData.country;

      if (Object.keys(healData).length > 0) {
        await adminDb
          .collection('barberProfiles')
          .doc(barberId)
          .update(healData);

        // Update pData in memory so mergedUserProfile below uses healed values
        // immediately without a second page load.
        Object.assign(pData, healData);
      }
    }

    const mergedUserProfile = {
      ...userData,
      firstName: pData.firstName || uData.firstName,
      lastName: pData.lastName || uData.lastName,
    };

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
      userProfile: mergedUserProfile as any,
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
