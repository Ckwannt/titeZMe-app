import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

const db = admin.firestore();

// Helper to rebuild searchSnapshot for a barber
async function updateBarberSearchSnapshot(barberId: string) {
  const profileRef = db.collection("barberProfiles").doc(barberId);
  const profileSnap = await profileRef.get();
  
  if (!profileSnap.exists) return;

  const profile = profileSnap.data() || {};
  
  // Get lowest price from services
  const servicesSnap = await db.collection("services").where("providerId", "==", barberId).get();
  let lowestPrice = Infinity;
  servicesSnap.forEach(doc => {
    const data = doc.data();
    if (data.price !== undefined && data.price < lowestPrice) {
      lowestPrice = data.price;
    }
  });

  // Also check titeZMeCut
  if (profile.titeZMeCut && profile.titeZMeCut.price < lowestPrice) {
    lowestPrice = profile.titeZMeCut.price;
  }

  if (lowestPrice === Infinity) lowestPrice = 0; // fallback

  // Get open/close status from schedule
  // Note: App shards schedules, so checking _shard_0
  const schedSnap = await db.collection("schedules").doc(`${barberId}_shard_0`).get();
  let isOpenToday = false;
  if (schedSnap.exists) {
    const sched = schedSnap.data() || {};
    const days = sched.weeklyHours?.days || [];
    const today = new Date().toLocaleDateString('en-US', {weekday: 'short'});
    isOpenToday = days.includes(today);
  }

  const searchSnapshot = {
    name: profile.name || (profile.firstName ? `${profile.firstName} ${profile.lastName}` : ""),
    city: profile.location?.city || "",
    country: profile.location?.country || "TN",
    lowestPrice,
    currency: "€",
    rating: profile.rating || 0,
    reviewCount: profile.totalReviews || profile.reviewCount || 0,
    vibes: profile.vibes || [],
    languages: profile.languages || ["EN"],
    topSpecialties: (profile.specialties || []).slice(0, 3),
    isLive: profile.isLive || false,
    photos: profile.photos || [], 
    isSolo: profile.isSolo !== undefined ? profile.isSolo : true,
    isOpenToday
  };

  await profileRef.update({ searchSnapshot });
}

export const onBarberUpdated = functions.firestore
  .document("barberProfiles/{barberId}")
  .onWrite(async (change, context) => {
    // Prevent infinite loop if only searchSnapshot changed
    const before = change.before.data();
    const after = change.after.data();
    
    if (before && after) {
      const copyBefore = { ...before };
      const copyAfter = { ...after };
      delete copyBefore.searchSnapshot;
      delete copyAfter.searchSnapshot;
      
      if (JSON.stringify(copyBefore) === JSON.stringify(copyAfter)) {
        return null;
      }
    }
    
    await updateBarberSearchSnapshot(context.params.barberId);
    return null;
  });

export const onBookingComplete = functions.firestore
  .document("bookings/{bookingId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // If booking was updated to "completed"
    if (before.status !== "completed" && after.status === "completed") {
      const barberId = after.providerId || after.barberId;
      if (!barberId) return null;

      const batch = db.batch();

      // Increment totalCuts for barber
      const profileRef = db.collection("barberProfiles").doc(barberId);
      batch.set(profileRef, { totalCuts: admin.firestore.FieldValue.increment(1) }, { merge: true });

      // If shopId exists, increment totalBookings for shop
      if (after.shopId) {
        const shopRef = db.collection("barbershops").doc(after.shopId);
        batch.set(shopRef, { totalBookings: admin.firestore.FieldValue.increment(1) }, { merge: true });
      }

      // Update Aggregation document
      const dateObj = after.date ? new Date(after.date) : new Date();
      const yyyy = dateObj.getFullYear();
      const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
      const aggId = `${barberId}_${yyyy}_${mm}`;
      const aggRef = db.collection("aggregations").doc(aggId);

      const price = Number(after.price) || 0;
      const hours = (Number(after.duration) || 30) / 60;

      batch.set(aggRef, {
        barberId,
        month: `${yyyy}-${mm}`,
        totalCuts: admin.firestore.FieldValue.increment(1),
        totalRevenue: admin.firestore.FieldValue.increment(price),
        totalHours: admin.firestore.FieldValue.increment(hours)
      }, { merge: true });

      await batch.commit();

      // Schedule a review request notification for client (dummy logic for delayed delivery)
      // Since native cloud task scheduling isn't configured, we'll store a notification
      if (after.clientId) {
        const notificationRef = db.collection("notifications").doc();
        await notificationRef.set({
          userId: after.clientId,
          type: "review_request",
          title: "Rate your cut!",
          message: `How was your trim with ${after.barberName}?`,
          bookingId: context.params.bookingId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          read: false,
          deliverAt: admin.firestore.Timestamp.fromMillis(Date.now() + 60 * 60 * 1000) // 1 Hour delay
        });
      }
    }

    return null;
  });

export const onReviewCreated = functions.firestore
  .document("reviews/{reviewId}")
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const barberId = review.providerId;
    if (!barberId) return null;

    const profileRef = db.collection("barberProfiles").doc(barberId);
    
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
        reviewCount: newCount
      });
    });

    // The onBarberUpdated trigger will handle updating searchSnapshot
    return null;
  });

export const scheduledCleanup = functions.pubsub
  .schedule("every 24 hours")
  .timeZone("UTC")
  .onRun(async (context) => {
    const now = Date.now();
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
    const fourteenDaysAgo = now - 14 * 24 * 60 * 60 * 1000;

    const batch = db.batch();

    // 1. Delete notifications older than 30 days
    const oldNotifications = await db.collection("notifications")
      .where("createdAt", "<", admin.firestore.Timestamp.fromMillis(thirtyDaysAgo))
      .limit(500)
      .get();
    oldNotifications.forEach(doc => batch.delete(doc.ref));

    // 2. Expire unresponded invites older than 14 days
    const oldInvites = await db.collection("invites")
      .where("status", "==", "pending")
      .where("createdAt", "<", fourteenDaysAgo)
      .limit(500)
      .get();
    oldInvites.forEach(doc => batch.update(doc.ref, { status: "expired" }));

    // Note: To clear past dates from schedules availableSlots, 
    // it requires reading every schedule. Skip heavy query for now
    // or run a paginated job.
    
    await batch.commit();
    return null;
  });

export const onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const uid = user.uid;
  const batch = db.batch();

  // Cleanup basic profile data
  const userRef = db.collection("users").doc(uid);
  const profileRef = db.collection("barberProfiles").doc(uid);
  const shopRef = db.collection("barbershops").doc(uid);
  const scheduleRef = db.collection("schedules").doc(`${uid}_shard_0`);

  batch.delete(userRef);
  batch.delete(profileRef);
  batch.delete(shopRef);
  batch.delete(scheduleRef);

  await batch.commit();
  console.log(`Successfully cleaned up data for deleted user ${uid}`);
  return null;
});

// Backward compatibility or existing triggers below
export const onBarberServiceUpdated = functions.firestore
  .document("services/{serviceId}")
  .onWrite(async (change, context) => {
    const data = change.after.exists ? change.after.data() : change.before.data();
    if (data && data.providerId) {
      await updateBarberSearchSnapshot(data.providerId);
    }
    return null;
  });

export const onBarberScheduleUpdated = functions.firestore
  .document("schedules/{barberId}")
  .onWrite(async (change, context) => {
    let barberId = context.params.barberId;
    if (barberId.includes("_shard_")) {
      barberId = barberId.split("_shard_")[0];
    }
    await updateBarberSearchSnapshot(barberId);
    return null;
  });

