import { NextResponse } from 'next/server';
import { isIsolatedPreview } from '@/lib/preview-boundary';

export async function POST(req: Request) {
  if (isIsolatedPreview()) return NextResponse.json({ error: 'Not found' }, { status: 404, headers: { 'Cache-Control': 'no-store' } });
  try {
    const admin = await import('firebase-admin');
    if (!admin.apps.length) {
      admin.initializeApp();
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    const age = Date.now() / 1000 - Number(decodedToken.auth_time);
    if (!Number.isFinite(age) || age < -60 || age > 300) return NextResponse.json({ error: 'Recent authentication required' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
    const { getFirestore } = await import('firebase-admin/firestore');
    const db = getFirestore(admin.app(), 'titezme-prod');

    // Fetch user doc to determine if they own a shop
    const userDoc = await db.collection('users').doc(uid).get();
    const ownsShop = userDoc.exists && userDoc.data()?.ownsShop === true;

    // Run all Firestore queries in parallel before batching
    const [shopBarbersSnap, invitesByShopSnap, invitesByBarberSnap, shopServicesSnap, barberServicesSnap] =
      await Promise.all([
        // Professionals who were in this user's business → clear their businessId
        db.collection('professionalProfiles').where('businessId', '==', uid).get(),
        // Invites this shop owner sent
        db.collection('invites').where('shopId', '==', uid).get(),
        // Invites this barber received
        db.collection('invites').where('barberId', '==', uid).get(),
        // Shop services owned by this user
        db.collection('services').where('providerId', '==', uid).where('providerType', '==', 'shop').get(),
        // Barber services owned by this user
        db.collection('services').where('providerId', '==', uid).where('providerType', '==', 'barber').get(),
      ]);

    const batch = db.batch();

    // 1. Nullify businessId on all professionals who belonged to this business
    shopBarbersSnap.forEach(d => batch.update(d.ref, { businessId: null }));

    // 2. Delete the business document if this user owned one
    if (ownsShop) {
      batch.delete(db.collection('businesses').doc(uid));
    }

    // 3. Delete all invites sent by this shop
    invitesByShopSnap.forEach(d => batch.delete(d.ref));

    // 4. Delete all invites received by this barber
    invitesByBarberSnap.forEach(d => batch.delete(d.ref));

    // 5. Delete shop services
    shopServicesSnap.forEach(d => batch.delete(d.ref));

    // 6. Delete barber services
    barberServicesSnap.forEach(d => batch.delete(d.ref));

    // 7. Delete professionalProfiles/{uid}
    batch.delete(db.collection('professionalProfiles').doc(uid));

    // 8. Delete users/{uid}
    batch.delete(db.collection('users').doc(uid));

    await batch.commit();

    // 9. Delete Firebase Auth account last (cannot be rolled back)
    await admin.auth().deleteUser(uid);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Account deletion unavailable' }, { status: 500, headers: { 'Cache-Control': 'no-store' } });
  }
}
