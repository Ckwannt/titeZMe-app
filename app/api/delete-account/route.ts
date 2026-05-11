import { NextResponse } from 'next/server';
export async function POST(req: Request) {
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
    const db = admin.firestore();

    const shopBarbersQ = await db.collection('barberProfiles').where('shopId', '==', uid).get();
    const batch = db.batch();
    
    shopBarbersQ.forEach(d => {
      batch.update(d.ref, { shopId: null });
    });
    
    await batch.commit();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Delete API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
