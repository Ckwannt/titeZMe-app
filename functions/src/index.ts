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
  const schedSnap = await db.collection("schedules").doc(barberId).get();
  let isOpenToday = false;
  if (schedSnap.exists) {
    const sched = schedSnap.data() || {};
    const days = sched.weeklyHours?.days || [];
    const today = new Date().toLocaleDateString('en-US', {weekday: 'short'});
    isOpenToday = days.includes(today);
  }

  const searchSnapshot = {
    name: profile.name || "",
    city: profile.location?.city || "",
    country: profile.location?.country || "TN",
    lowestPrice,
    currency: "€",
    rating: profile.rating || 0,
    reviewCount: profile.reviewCount || 0,
    vibes: profile.vibes || [],
    languages: profile.languages || ["EN"],
    topSpecialties: (profile.specialties || []).slice(0, 3),
    isLive: profile.isLive || false,
    photos: profile.photos || [], // adding photos since search needs it
    isSolo: profile.isSolo !== undefined ? profile.isSolo : true,
    isOpenToday
  };

  await profileRef.update({ searchSnapshot });
}

export const onBarberProfileUpdated = functions.firestore
  .document("barberProfiles/{barberId}")
  .onWrite(async (change, context) => {
    // Prevent infinite loop if only searchSnapshot changed
    const before = change.before.data();
    const after = change.after.data();
    
    if (before && after) {
      // Check if the only thing that changed is the searchSnapshot
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
    await updateBarberSearchSnapshot(context.params.barberId);
    return null;
  });
