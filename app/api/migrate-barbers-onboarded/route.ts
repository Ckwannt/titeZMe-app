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
export async function GET(request: Request) {
  try {
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp();
    }
    const adminAuth = admin.auth();
    const adminDb = admin.firestore();

    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
      const decoded = await adminAuth.verifyIdToken(token);
      const userDoc = await adminDb.collection('users').doc(decoded.uid).get();

      if (userDoc.data()?.role !== 'admin') {
        return Response.json({ error: 'Forbidden' }, { status: 403 });
      }
    } catch {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const snap = await adminDb
      .collection('barberProfiles')
      .where('isLive', '==', true)
      .get();

    let updated = 0;
    let skipped = 0;
    const batch = adminDb.batch();

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
