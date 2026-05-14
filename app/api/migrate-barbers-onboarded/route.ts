/**
 * ONE-TIME MIGRATION — Run once then delete this file.
 *
 * Backfills isOnboarded: true onto all barberProfiles documents
 * that have isLive: true but are missing the isOnboarded field.
 *
 * Call:  GET /api/migrate-barbers-onboarded
 *
 * DELETE THIS FILE after running it once successfully.
 */

import { NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getAdmin() {
  if (getApps().length === 0) {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  }
  return getFirestore();
}

export async function GET() {
  try {
    const db = getAdmin();

    const snap = await db
      .collection('barberProfiles')
      .where('isLive', '==', true)
      .get();

    let updated = 0;
    let skipped = 0;
    const batch = db.batch();

    for (const docSnap of snap.docs) {
      const data = docSnap.data();
      if (data.isOnboarded === true) {
        skipped++;
        continue;
      }
      batch.update(docSnap.ref, { isOnboarded: true });
      updated++;
    }

    if (updated > 0) {
      await batch.commit();
    }

    return NextResponse.json({
      success: true,
      message: `Migration complete. Updated: ${updated}, Already had isOnboarded: ${skipped}`,
      updated,
      skipped,
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
