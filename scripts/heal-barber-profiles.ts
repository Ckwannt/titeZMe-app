import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId:   process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:  process.env.FIREBASE_ADMIN_PRIVATE_KEY
                     ?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore(getApp(), 'titezme-prod');

async function healBarberProfiles() {
  console.log('Starting barberProfiles heal...');

  const barbersSnap = await db
    .collection('barberProfiles')
    .get();

  let healed = 0;
  let skipped = 0;

  for (const doc of barbersSnap.docs) {
    const profile = doc.data();

    // Skip if already has firstName
    if (profile.firstName) {
      console.log(`SKIP ${doc.id} — already has firstName: ${profile.firstName}`);
      skipped++;
      continue;
    }

    // Fetch users doc
    const userDoc = await db
      .collection('users')
      .doc(doc.id)
      .get();

    if (!userDoc.exists) {
      console.log(`SKIP ${doc.id} — no users doc found`);
      skipped++;
      continue;
    }

    const user = userDoc.data()!;
    const healData: Record<string, any> = {};

    if (!profile.firstName  && user.firstName)
      healData.firstName  = user.firstName;
    if (!profile.lastName   && user.lastName)
      healData.lastName   = user.lastName;
    if (!profile.photoUrl   && user.photoUrl)
      healData.photoUrl   = user.photoUrl;
    if (!profile.createdAt  && user.createdAt)
      healData.createdAt  = user.createdAt;

    if (Object.keys(healData).length === 0) {
      console.log(`SKIP ${doc.id} — nothing to heal`);
      skipped++;
      continue;
    }

    await db
      .collection('barberProfiles')
      .doc(doc.id)
      .update(healData);

    console.log(`HEALED ${doc.id} →`, healData);
    healed++;
  }

  console.log(`Done. Healed: ${healed}, Skipped: ${skipped}`);
}

healBarberProfiles().catch(console.error);
