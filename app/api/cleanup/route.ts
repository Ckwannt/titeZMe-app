import { NextResponse } from 'next/server';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

export async function GET(req: Request) {
  try {
    const db = admin.firestore();
    const auth = admin.auth();

    // 1. Find all users where role == 'shop_owner'
    const usersSnapshot = await db.collection('users').where('role', '==', 'shop_owner').get();
    
    const deletedUsers = [];
    const errors = [];

    // Process each shop_owner user
    for (const userDoc of usersSnapshot.docs) {
      const uid = userDoc.id;
      
      try {
        // Delete from Authentication
        try {
          await auth.deleteUser(uid);
        } catch (authErr: any) {
          if (authErr.code !== 'auth/user-not-found') {
            console.error(`Error deleting auth user ${uid}`, authErr);
          }
        }

        const batch = db.batch();

        // Delete from users collection
        batch.delete(db.collection('users').doc(uid));

        // Delete from barbershops collection
        batch.delete(db.collection('barbershops').doc(uid));

        // Delete their notifications (query where userId == uid)
        const notificationsSnapshot = await db.collection('notifications').where('userId', '==', uid).get();
        notificationsSnapshot.forEach((doc) => {
          batch.delete(doc.ref);
        });

        // Delete any invites they sent (assuming invites collection has shopId == uid)
        const invitesSnapshot = await db.collection('invites').where('shopId', '==', uid).get();
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
