import * as admin from 'firebase-admin';
import { getFirestore, FieldValue, Timestamp } from 'firebase-admin/firestore';
import { algoliasearch } from 'algoliasearch';
import {
  onDocumentWritten,
  onDocumentUpdated,
  onDocumentCreated,
} from 'firebase-functions/v2/firestore';
import * as functionsV1 from 'firebase-functions/v1';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { setGlobalOptions } from 'firebase-functions/v2';

setGlobalOptions({ region: 'europe-west2' });

const DATABASE_ID =
  'ai-studio-a8aba99a-6d28-4780-b075-b9829cce70f1';
const ALGOLIA_INDEX = 'barbers';

admin.initializeApp();
const db = getFirestore(admin.app(), DATABASE_ID);

function getAlgoliaClient() {
  return algoliasearch(
    process.env.ALGOLIA_APP_ID || '',
    process.env.ALGOLIA_ADMIN_KEY || ''
  );
}

async function syncBarberToAlgolia(
  barberId: string
): Promise<void> {
  const profileRef = db
    .collection('barberProfiles')
    .doc(barberId);
  const profileSnap = await profileRef.get();
  if (!profileSnap.exists) return;
  const profile = profileSnap.data() || {};

  // Skip if barber is not live or not approved
  if (
    !profile.isLive ||
    profile.approvalStatus !== 'approved'
  ) {
    // Remove from Algolia if they were
    // previously live but are now offline
    try {
      await getAlgoliaClient().deleteObject({
        indexName: ALGOLIA_INDEX,
        objectID: barberId,
      });
    } catch {
      // Not in index — that's fine
    }
    return;
  }

  // Get name and photo from users doc
  const userSnap = await db
    .collection('users')
    .doc(barberId)
    .get();
  const user = userSnap.exists
    ? userSnap.data() || {}
    : {};

  // Get min price from services
  const servicesSnap = await db
    .collection('services')
    .where('providerId', '==', barberId)
    .get();
  let minPrice = profile.titeZMeCut?.price || 0;
  servicesSnap.forEach((doc) => {
    const price = doc.data().price;
    if (
      typeof price === 'number' &&
      (minPrice === 0 || price < minPrice)
    ) {
      minPrice = price;
    }
  });

  // Get schedule for open hours
  const schedSnap = await db
    .collection('schedules')
    .doc(`${barberId}_shard_0`)
    .get();
  const sched = schedSnap.exists
    ? schedSnap.data() || {}
    : {};
  const weeklyDays: string[] =
    sched.weeklyHours?.days || [];
  const opensAt: string =
    sched.weeklyHours?.opensAt || '09:00';
  const closesAt: string =
    sched.weeklyHours?.closesAt || '18:00';

  const record = {
    objectID:       barberId,
    firstName:      user.firstName || '',
    lastName:       user.lastName  || '',
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    photoUrl:
      profile.profilePhotoUrl ||
      user.photoUrl            ||
      '',
    city:           profile.city     || '',
    country:        profile.country  || '',
    languages:      profile.languages  || [],
    specialties:    profile.specialties || [],
    vibes:          profile.vibes       || [],
    rating:         profile.rating      || 0,
    reviewCount:
      profile.reviewCount ||
      profile.totalReviews ||
      0,
    minPrice,
    currency:       profile.currency || '€',
    barberCode:     profile.barberCode || '',
    isLive:         profile.isLive,
    approvalStatus: profile.approvalStatus,
    isSolo:         profile.isSolo !== false,
    shopId:         profile.shopId || null,
    titeZMeCut:     profile.titeZMeCut || null,
    weeklyDays,
    opensAt,
    closesAt,
    isFake:    profile.isFake    === true,
    isVisible: profile.isVisible !== false,
  };

  await getAlgoliaClient().saveObject({
    indexName: ALGOLIA_INDEX,
    body: record,
  });
}

export const onBarberUpdated = onDocumentWritten(
  {
    document: 'barberProfiles/{barberId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const barberId = event.params.barberId;

    // Handle deletion
    if (!event.data?.after.exists) {
      try {
        await getAlgoliaClient().deleteObject({
          indexName: ALGOLIA_INDEX,
          objectID: barberId,
        });
      } catch {
        // Not in index — that's fine
      }
      return;
    }

    await syncBarberToAlgolia(barberId);

    // ── Self-healing: when a real barber gets approved, hide one fake ─────
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (
      before?.approvalStatus !== 'approved' &&
      after?.approvalStatus === 'approved' &&
      after?.isFake !== true
    ) {
      const city = after?.city || '';
      let fakeQuery = await db
        .collection('barberProfiles')
        .where('isFake', '==', true)
        .where('isVisible', '==', true)
        .where('city', '==', city)
        .limit(1)
        .get();

      if (fakeQuery.empty) {
        fakeQuery = await db
          .collection('barberProfiles')
          .where('isFake', '==', true)
          .where('isVisible', '==', true)
          .limit(1)
          .get();
      }

      if (!fakeQuery.empty) {
        await fakeQuery.docs[0].ref.update({ isVisible: false });
      }
    }
  }
);

export const onBookingComplete = onDocumentUpdated(
  {
    document: 'bookings/{bookingId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const before = event.data?.before.data();
    const after  = event.data?.after.data();
    if (!before || !after) return;

    // If booking was updated to "completed"
    if (before.status !== 'completed' && after.status === 'completed') {
      const barberId = after.providerId || after.barberId;
      if (!barberId) return;

      const batch = db.batch();

      // Increment totalCuts for barber
      const profileRef = db.collection('barberProfiles').doc(barberId);
      batch.set(profileRef, { totalCuts: FieldValue.increment(1) }, { merge: true });

      // If shopId exists, increment totalBookings for shop
      if (after.shopId) {
        const shopRef = db.collection('barbershops').doc(after.shopId);
        batch.set(shopRef, { totalBookings: FieldValue.increment(1) }, { merge: true });
      }

      // Update Aggregation document
      const dateObj = after.date ? new Date(after.date) : new Date();
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const aggId = `${barberId}_${yyyy}_${mm}`;
      const aggRef = db.collection('aggregations').doc(aggId);

      const price = Number(after.price) || 0;
      const hours = (Number(after.duration) || 30) / 60;

      batch.set(aggRef, {
        barberId,
        month: `${yyyy}-${mm}`,
        totalCuts: FieldValue.increment(1),
        totalRevenue: FieldValue.increment(price),
        totalHours: FieldValue.increment(hours),
      }, { merge: true });

      await batch.commit();

      // Schedule a review request notification for client
      if (after.clientId) {
        const notificationRef = db.collection('notifications').doc();
        await notificationRef.set({
          userId: after.clientId,
          type: 'review_request',
          title: 'Rate your cut!',
          message: `How was your trim with ${after.barberName}?`,
          bookingId: event.params.bookingId,
          createdAt: FieldValue.serverTimestamp(),
          read: false,
          deliverAt: Timestamp.fromMillis(Date.now() + 60 * 60 * 1000), // 1 Hour delay
        });
      }
    }
  }
);

export const onReviewCreated = onDocumentCreated(
  {
    document: 'reviews/{reviewId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const review = event.data?.data();
    if (!review) return;

    const barberId = review.providerId;
    if (!barberId) return;

    const profileRef = db.collection('barberProfiles').doc(barberId);

    await db.runTransaction(async (transaction) => {
      const profileSnap = await transaction.get(profileRef);
      if (!profileSnap.exists) return;

      const profile = profileSnap.data();
      const currentRating = profile?.rating || 0;
      const currentCount = profile?.totalReviews || profile?.reviewCount || 0;

      const newRatingScore = review.rating || 0;
      const newCount = currentCount + 1;
      const newRating = ((currentRating * currentCount) + newRatingScore) / newCount;

      transaction.update(profileRef, {
        rating: newRating,
        totalReviews: newCount,
        reviewCount: newCount,
      });
    });
  }
);

export const scheduledCleanup = onSchedule(
  'every 24 hours',
  async () => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

    const batch = db.batch();

    // 1. Delete notifications older than 30 days
    const oldNotifications = await db.collection('notifications')
      .where('createdAt', '<', Timestamp.fromMillis(thirtyDaysAgo))
      .limit(500)
      .get();
    oldNotifications.forEach((doc) => batch.delete(doc.ref));

    // 2. Expire unresponded invites older than 14 days
    const oldInvites = await db.collection('invites')
      .where('status', '==', 'pending')
      .where('createdAt', '<', fourteenDaysAgo)
      .limit(500)
      .get();
    oldInvites.forEach((doc) => batch.update(doc.ref, { status: 'expired' }));

    await batch.commit();
  }
);

export const onUserDeleted = functionsV1
  .region('europe-west2')
  .auth
  .user()
  .onDelete(async (user) => {
    const uid = user.uid;
    const batch = db.batch();

    // Cleanup basic profile data
    const userRef = db.collection('users').doc(uid);
    const profileRef = db.collection('barberProfiles').doc(uid);
    const shopRef = db.collection('barbershops').doc(uid);
    const scheduleRef = db.collection('schedules').doc(`${uid}_shard_0`);

    batch.delete(userRef);
    batch.delete(profileRef);
    batch.delete(shopRef);
    batch.delete(scheduleRef);

    await batch.commit();

    // Cancel pending/confirmed bookings for this barber.
    // For in-app deletions, deleteBarberAccount() already
    // cancelled these before reaching here — the query
    // returns empty and this block is a no-op.
    // For admin Console or SDK deletions that bypass the
    // app flow, this is the only place that handles cleanup.
    const activeBookings = await db
      .collection('bookings')
      .where('barberId', '==', uid)
      .where('status', 'in', ['pending', 'confirmed'])
      .get();

    if (!activeBookings.empty) {
      const cleanupBatch = db.batch();
      const now = Date.now();

      for (const bookingDoc of activeBookings.docs) {
        cleanupBatch.update(bookingDoc.ref, {
          status: 'cancelled_by_barber',
          updatedAt: now,
          cancellationReason: 'account_deleted',
        });

        const notifRef = db.collection('notifications').doc();
        cleanupBatch.set(notifRef, {
          userId: bookingDoc.data().clientId,
          message: 'A barber you booked has deleted their account. Your booking was cancelled.',
          read: false,
          createdAt: now,
          linkTo: '/dashboard/client',
        });
      }

      await cleanupBatch.commit();
      console.log(
        `Cancelled ${activeBookings.size} active booking(s) for deleted user ${uid}`
      );
    }

    console.log(`Successfully cleaned up data for deleted user ${uid}`);
});

export const onBarberServiceUpdated = onDocumentWritten(
  {
    document: 'services/{serviceId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const data = event.data?.after.exists
      ? event.data.after.data()
      : event.data?.before.data();
    if (data && data.providerId) {
      await syncBarberToAlgolia(data.providerId);
    }
  }
);

export const onBarberScheduleUpdated = onDocumentWritten(
  {
    document: 'schedules/{scheduleId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const barberId = event.params.scheduleId
      .replace('_shard_0', '');
    await syncBarberToAlgolia(barberId);
  }
);
