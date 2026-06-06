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

    // 1. Find all users where role == 'shop_owner'
    const usersSnapshot = await adminDb.collection('users').where('role', '==', 'shop_owner').get();
    
    const deletedUsers = [];
    const errors = [];

    // Process each shop_owner user
    for (const userDoc of usersSnapshot.docs) {
      const uid = userDoc.id;
      
      try {
        // Delete from Authentication
        try {
          await adminAuth.deleteUser(uid);
        } catch (authErr: any) {
          if (authErr.code !== 'auth/user-not-found') {
            console.error(`Error deleting auth user ${uid}`, authErr);
          }
        }

        const batch = adminDb.batch();

        // Delete from users collection
        batch.delete(adminDb.collection('users').doc(uid));

        // Delete from barbershops collection
        batch.delete(adminDb.collection('barbershops').doc(uid));

        // Delete their notifications (query where userId == uid)
        const notificationsSnapshot = await adminDb.collection('notifications').where('userId', '==', uid).get();
        notificationsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete any invites they sent (assuming invites collection has shopId == uid)
        const invitesSnapshot = await adminDb.collection('invites').where('shopId', '==', uid).get();
        invitesSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Commit all deletes for this user
        await batch.commit();

        deletedUsers.push(uid);
      } catch (err: any) {
        errors.push({ uid, error: err.message });
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Cleanup completed',
      deletedCount: deletedUsers.length,
      deletedUsers,
      errors
    });
  } catch (error: any) {
    console.error('Cleanup script error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
