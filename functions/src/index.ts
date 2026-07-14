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
  'titezme-prod';
const ALGOLIA_INDEX = 'professionals';
const ALGOLIA_SHOP_INDEX = 'businesses';
const ALGOLIA_CHALLENGE_BARBERS_INDEX = 'challenge_professionals';
const ALGOLIA_CHALLENGE_SHOPS_INDEX = 'challenge_businesses';

admin.initializeApp();
const db = getFirestore(admin.app(), DATABASE_ID);

function getAlgoliaClient() {
  return algoliasearch(
    process.env.ALGOLIA_APP_ID || '',
    process.env.ALGOLIA_ADMIN_KEY || ''
  );
}

async function syncProfessionalToAlgolia(
  professionalId: string
): Promise<void> {
  const profileRef = db
    .collection('professionalProfiles')
    .doc(professionalId);
  const profileSnap = await profileRef.get();
  if (!profileSnap.exists) return;
  const profile = profileSnap.data() || {};

  // Skip if professional is not live or not approved
  if (
    !profile.isLive ||
    profile.approvalStatus !== 'approved'
  ) {
    // Remove from Algolia if they were
    // previously live but are now offline
    try {
      await getAlgoliaClient().deleteObject({
        indexName: ALGOLIA_INDEX,
        objectID: professionalId,
      });
    } catch {
      // Not in index — that's fine
    }
    return;
  }

  // Get name and photo from users doc
  const userSnap = await db
    .collection('users')
    .doc(professionalId)
    .get();
  const user = userSnap.exists
    ? userSnap.data() || {}
    : {};

  // Get min price from services
  const servicesSnap = await db
    .collection('services')
    .where('providerId', '==', professionalId)
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
    .doc(`${professionalId}_shard_0`)
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
    objectID:        professionalId,
    firstName:       user.firstName || '',
    lastName:        user.lastName  || '',
    fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
    photoUrl:
      profile.profilePhotoUrl ||
      user.photoUrl            ||
      '',
    city:            profile.city     || '',
    country:         profile.country  || '',
    languages:       profile.languages   || [],
    specialties:     profile.specialties || [],
    vibes:           profile.vibe        || [],
    rating:          profile.rating      || 0,
    reviewCount:
      profile.reviewCount ||
      profile.totalReviews ||
      0,
    minPrice,
    currency:         profile.currency || '€',
    professionalCode: profile.professionalCode || '',
    isLive:           profile.isLive,
    approvalStatus:   profile.approvalStatus,
    isSolo:           profile.businessId == null,
    businessId:       profile.businessId || null,
    titeZMeCut:       profile.titeZMeCut || null,
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

export const onProfessionalUpdated = onDocumentWritten(
  {
    document: 'professionalProfiles/{professionalId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const professionalId = event.params.professionalId;

    // Handle deletion
    if (!event.data?.after.exists) {
      try {
        await getAlgoliaClient().deleteObject({
          indexName: ALGOLIA_INDEX,
          objectID: professionalId,
        });
      } catch {
        // Not in index — that's fine
      }
      return;
    }

    await syncProfessionalToAlgolia(professionalId);

    // ── Self-healing: when a real professional gets approved, hide one fake ─
    const before = event.data?.before.data();
    const after = event.data?.after.data();
    if (
      before?.approvalStatus !== 'approved' &&
      after?.approvalStatus === 'approved' &&
      after?.isFake !== true
    ) {
      const city = after?.city || '';
      let fakeQuery = await db
        .collection('professionalProfiles')
        .where('isFake', '==', true)
        .where('isVisible', '==', true)
        .where('city', '==', city)
        .limit(1)
        .get();

      if (fakeQuery.empty) {
        fakeQuery = await db
          .collection('professionalProfiles')
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

      // Increment totalCuts for professional
      const profileRef = db.collection('professionalProfiles').doc(barberId);
      batch.set(profileRef, { totalCuts: FieldValue.increment(1) }, { merge: true });

      // If shopId (business id) exists on the booking, increment totalBookings on the business
      if (after.shopId) {
        const businessRef = db.collection('businesses').doc(after.shopId);
        batch.set(businessRef, { totalBookings: FieldValue.increment(1) }, { merge: true });
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

    const profileRef = db.collection('professionalProfiles').doc(barberId);

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
    const profileRef = db.collection('professionalProfiles').doc(uid);
    const businessRef = db.collection('businesses').doc(uid);
    const scheduleRef = db.collection('schedules').doc(`${uid}_shard_0`);

    batch.delete(userRef);
    batch.delete(profileRef);
    batch.delete(businessRef);
    batch.delete(scheduleRef);

    await batch.commit();

    // Cancel pending/confirmed bookings for this professional.
    // For in-app deletions, the account-deletion flow already
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
          message: 'A professional you booked has deleted their account. Your booking was cancelled.',
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

export const onProfessionalServiceUpdated = onDocumentWritten(
  {
    document: 'services/{serviceId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const data = event.data?.after.exists
      ? event.data.after.data()
      : event.data?.before.data();
    // Skip sync for fake-professional service writes
    // (fakes are static, syncing once via profile write is enough)
    if (data?.isFake === true) {
      return;
    }
    if (data && data.providerId) {
      await syncProfessionalToAlgolia(data.providerId);
    }
  }
);

export const onProfessionalScheduleUpdated = onDocumentWritten(
  {
    document: 'schedules/{scheduleId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const professionalId = event.params.scheduleId
      .replace('_shard_0', '');
    // For fake-professional schedule writes, skip re-sync
    // (schedule itself doesn't carry isFake — check parent profile)
    const profileSnap = await db.collection('professionalProfiles').doc(professionalId).get();
    if (profileSnap.exists && profileSnap.data()?.isFake === true) {
      return;
    }
    await syncProfessionalToAlgolia(professionalId);
  }
);

// ─────────────────────────────────────────────────────────────────────
// Challenge — submission sync to Algolia
// ─────────────────────────────────────────────────────────────────────
export const onChallengeSubmissionWritten = onDocumentWritten(
  {
    document: 'challengeSubmissions/{submissionId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const submissionId = event.params.submissionId;
    const before = event.data?.before.exists ? event.data.before.data() : null;
    const after = event.data?.after.exists ? event.data.after.data() : null;

    // Deletion — remove from both challenge indexes
    if (!after) {
      try {
        await getAlgoliaClient().deleteObject({
          indexName: ALGOLIA_CHALLENGE_BARBERS_INDEX,
          objectID: submissionId,
        });
      } catch {
        // Not in index — that's fine
      }
      try {
        await getAlgoliaClient().deleteObject({
          indexName: ALGOLIA_CHALLENGE_SHOPS_INDEX,
          objectID: submissionId,
        });
      } catch {
        // Not in index — that's fine
      }
      return;
    }

    const type = after.type;
    const indexName =
      type === 'barber'
        ? ALGOLIA_CHALLENGE_BARBERS_INDEX
        : type === 'shop'
        ? ALGOLIA_CHALLENGE_SHOPS_INDEX
        : null;

    if (!indexName) return;

    const wasApproved = before?.status === 'approved';
    const isApproved = after.status === 'approved';

    // Status moved away from approved → remove from index
    if (wasApproved && !isApproved) {
      try {
        await getAlgoliaClient().deleteObject({
          indexName,
          objectID: submissionId,
        });
      } catch {
        // Not in index — that's fine
      }
      return;
    }

    // Not currently approved → nothing to index
    if (!isApproved) return;

    // Approved (newly or already) → save / refresh record
    const record = {
      objectID: submissionId,
      userId: after.userId || '',
      type,
      submitterName: after.submitterName || '',
      submitterCity: after.submitterCity || '',
      submitterAvatarUrl: after.submitterAvatarUrl || '',
      barberCode: after.barberCode || '',
      shopId: after.shopId || '',
      photos: after.photos || [],
      videoUrl: after.videoUrl || '',
      description: after.description || '',
      voteCount: after.voteCount || 0,
      submittedAt: after.submittedAt || null,
      approvedAt: after.approvedAt || null,
    };

    await getAlgoliaClient().saveObject({
      indexName,
      body: record,
    });
  }
);

// ─────────────────────────────────────────────────────────────────────
// Challenge — vote tally + denormalize on user
// ─────────────────────────────────────────────────────────────────────
export const onChallengeVoteCreated = onDocumentCreated(
  {
    document: 'challengeVotes/{voteId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const vote = event.data?.data();
    if (!vote) return;

    const voterUid = vote.voterUid;
    const type = vote.type;
    const submissionId = vote.submissionId;

    if (!voterUid || !type || !submissionId) {
      console.error(
        `Challenge vote ${event.params.voteId} missing required fields`,
        { voterUid, type, submissionId }
      );
      return;
    }

    const submissionRef = db.collection('challengeSubmissions').doc(submissionId);
    const userRef = db.collection('users').doc(voterUid);

    const userUpdate: Record<string, string> = {};
    if (type === 'barber') {
      userUpdate.challengeVotedForBarber = submissionId;
    } else if (type === 'shop') {
      userUpdate.challengeVotedForShop = submissionId;
    } else {
      console.error(`Unknown challenge vote type: ${type}`);
      return;
    }

    const batch = db.batch();
    batch.set(submissionRef, { voteCount: FieldValue.increment(1) }, { merge: true });
    batch.set(userRef, userUpdate, { merge: true });
    await batch.commit();
  }
);

// ─────────────────────────────────────────────────────────────────────
// Businesses — Algolia sync
// ─────────────────────────────────────────────────────────────────────
async function syncBusinessToAlgolia(businessId: string, data: FirebaseFirestore.DocumentData): Promise<void> {
  const address = data.address || {};

  // barbersCount is now derived by querying professionalProfiles
  // (the `barbers[]` array on the business doc was dropped in Phase 2).
  const teamSnap = await db
    .collection('professionalProfiles')
    .where('businessId', '==', businessId)
    .get();

  const record = {
    objectID: businessId,
    ownerId: data.ownerId || '',
    name: data.name || '',
    city: address.city || '',
    country: address.country || '',
    contactPhone: data.contactPhone || '',
    logoUrl: data.logoUrl || '',
    coverPhotoUrl: data.coverPhotoUrl || '',
    description: data.description || '',
    barbersCount: teamSnap.size,
    status: data.status || '',
  };

  await getAlgoliaClient().saveObject({
    indexName: ALGOLIA_SHOP_INDEX,
    body: record,
  });
}

export const onBusinessWritten = onDocumentWritten(
  {
    document: 'businesses/{businessId}',
    database: DATABASE_ID,
  },
  async (event) => {
    const businessId = event.params.businessId;
    const after = event.data?.after.exists ? event.data.after.data() : null;

    // Deletion → remove from index
    if (!after) {
      try {
        await getAlgoliaClient().deleteObject({
          indexName: ALGOLIA_SHOP_INDEX,
          objectID: businessId,
        });
      } catch {
        // Not in index — that's fine
      }
      return;
    }

    if (after.status === 'active') {
      await syncBusinessToAlgolia(businessId, after);
      return;
    }

    if (after.status === 'inactive' || after.status === 'suspended') {
      try {
        await getAlgoliaClient().deleteObject({
          indexName: ALGOLIA_SHOP_INDEX,
          objectID: businessId,
        });
      } catch {
        // Not in index — that's fine
      }
    }
  }
);

// ─────────────────────────────────────────────────────────────────────
// Challenge — scheduled state-flag check
// ─────────────────────────────────────────────────────────────────────
export const scheduledChallengeStateCheck = onSchedule(
  {
    schedule: 'every 5 minutes',
    timeZone: 'Europe/Madrid',
  },
  async () => {
    const configRef = db.collection('siteConfig').doc('challenge');
    const configSnap = await configRef.get();
    if (!configSnap.exists) return;

    const data = configSnap.data() || {};
    const now = Date.now();

    const votingCloseAt =
      typeof data.votingCloseAt === 'number'
        ? data.votingCloseAt
        : data.votingCloseAt?.toMillis?.() ?? 0;

    if (
      votingCloseAt &&
      now >= votingCloseAt &&
      data.publicLeaderboardEnabled === true
    ) {
      await configRef.update({ publicLeaderboardEnabled: false });
      console.log('Challenge voting closed — leaderboard disabled');
    }
  }
);
