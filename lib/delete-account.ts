// Account deletion helpers for client / barber / shop-owner.
//
// Real-life behavior:
//   * Future bookings are cancelled with notification to the other party.
//   * Past completed/cancelled bookings are ANONYMIZED (not deleted) so
//     barber stats, shop history and audit trails remain intact.
//   * Cut counts are preserved on the per-booking record (barberId is left
//     untouched when a shop is deleted, shopId is left untouched when a
//     barber is deleted), so neither side loses historical numbers.
//   * Firebase Auth is deleted LAST so a `requires-recent-login` error
//     surfaces before any irreversible Firestore writes happen on retry.
//
// All Firestore writes go through BatchManager which auto-flushes at 400
// operations (Firestore's hard cap is 500 — we leave headroom).

import {
  doc,
  collection,
  query,
  where,
  getDocs,
  getDoc,
  writeBatch,
  type WriteBatch,
} from 'firebase/firestore';
import {
  deleteUser,
  reauthenticateWithCredential,
  reauthenticateWithPopup,
  EmailAuthProvider,
  GoogleAuthProvider,
} from 'firebase/auth';
import { db, auth } from './firebase';

// Firestore caps batches at 500 ops. We chunk at 400 to leave headroom.
const MAX_OPS_PER_BATCH = 400;

// Sentinel values used to anonymize records of deleted accounts.
const DELETED_USER_ID = 'deleted_user';
const DELETED_USER_NAME = 'Anonymous';
const DELETED_BARBER_ID = 'deleted_barber';
const DELETED_BARBER_NAME = 'Former Barber';
const DELETED_SHOP_ID = 'deleted_shop';
const DELETED_SHOP_NAME = 'Deleted Shop';

// Past-booking statuses we want to anonymize. Intentionally excludes
// 'no_show' and 'disputed' — those status values don't exist in this app's
// data model (see lib/types.ts Booking + firestore.rules isValidBooking).
const PAST_STATUSES = [
  'completed',
  'cancelled',
  'cancelled_by_client',
  'cancelled_by_barber',
];

/**
 * Chunked Firestore batch writer. Auto-flushes when ops hit MAX_OPS_PER_BATCH
 * to stay under the 500-op limit. Use ONE instance per logical operation tree,
 * then call commit() at the end to flush the trailing chunk.
 *
 * Each set/update/delete is async because it may trigger an intermediate
 * commit when the current chunk is full.
 */
class BatchManager {
  private currentBatch: WriteBatch;
  private currentCount = 0;

  constructor() {
    this.currentBatch = writeBatch(db);
  }

  private async maybeFlush(): Promise<void> {
    if (this.currentCount >= MAX_OPS_PER_BATCH) {
      await this.currentBatch.commit();
      this.currentBatch = writeBatch(db);
      this.currentCount = 0;
    }
  }

  async set(ref: any, data: any, options?: any): Promise<void> {
    await this.maybeFlush();
    if (options) this.currentBatch.set(ref, data, options);
    else this.currentBatch.set(ref, data);
    this.currentCount++;
  }

  async update(ref: any, data: any): Promise<void> {
    await this.maybeFlush();
    this.currentBatch.update(ref, data);
    this.currentCount++;
  }

  async delete(ref: any): Promise<void> {
    await this.maybeFlush();
    this.currentBatch.delete(ref);
    this.currentCount++;
  }

  async commit(): Promise<void> {
    if (this.currentCount > 0) {
      await this.currentBatch.commit();
      this.currentBatch = writeBatch(db);
      this.currentCount = 0;
    }
  }
}

/**
 * Delete a client account.
 *
 *   1. Cancel future bookings + notify each barber.
 *   2. Anonymize past completed/cancelled bookings (clientId, clientName).
 *      Keep the booking row so barber totalCuts / shop history reference
 *      something real.
 *   3. Anonymize reviews left by the client (barber keeps their rating).
 *   4. Delete notifications addressed to this user.
 *   5. Delete users/{uid}.
 *   6. Delete the Firebase Auth user (LAST — irreversible).
 */
export async function deleteClientAccount(uid: string): Promise<void> {
  const mgr = new BatchManager();

  // 1. Cancel future bookings + notify barbers
  const futureBookings = await getDocs(query(
    collection(db, 'bookings'),
    where('clientId', '==', uid),
    where('status', 'in', ['pending', 'confirmed'])
  ));

  for (const booking of futureBookings.docs) {
    await mgr.update(booking.ref, {
      status: 'cancelled_by_client',
      updatedAt: Date.now(),
      cancellationReason: 'account_deleted',
    });

    const notifRef = doc(collection(db, 'notifications'));
    await mgr.set(notifRef, {
      userId: booking.data().barberId,
      type: 'booking_cancelled',
      message: 'A client deleted their account. Their booking was cancelled.',
      bookingId: booking.id,
      read: false,
      createdAt: Date.now(),
    });
  }

  // 2. Anonymize past bookings (do NOT delete — barber stats reference them)
  const pastBookings = await getDocs(query(
    collection(db, 'bookings'),
    where('clientId', '==', uid),
    where('status', 'in', PAST_STATUSES)
  ));

  for (const d of pastBookings.docs) {
    await mgr.update(d.ref, {
      clientId: DELETED_USER_ID,
      clientName: DELETED_USER_NAME,
    });
  }

  // 3. Anonymize reviews (keep rating attached to barber)
  const reviews = await getDocs(query(
    collection(db, 'reviews'),
    where('clientId', '==', uid)
  ));

  for (const d of reviews.docs) {
    await mgr.update(d.ref, {
      clientId: DELETED_USER_ID,
      clientName: DELETED_USER_NAME,
    });
  }

  // 4. Delete notifications
  const notifications = await getDocs(query(
    collection(db, 'notifications'),
    where('userId', '==', uid)
  ));

  for (const d of notifications.docs) {
    await mgr.delete(d.ref);
  }

  // 5. Delete user doc
  await mgr.delete(doc(db, 'users', uid));

  // Commit all Firestore changes
  await mgr.commit();

  // 6. Delete Firebase Auth (LAST — cannot be rolled back)
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
}

/**
 * Delete a barber account.
 *
 *   1. Read barberProfile to learn shop membership.
 *   2. Cancel future bookings + notify clients.
 *   3. Anonymize past bookings (barberId, barberName).
 *      shopId is left UNTOUCHED — shop's historical cut count is preserved.
 *   4. Delete reviews this barber received (no profile to show them on).
 *   5. Anonymize reviews this barber left as a client.
 *   6. If in a shop, remove from team + notify owner.
 *   7. Delete services owned by this barber.
 *   8. Delete schedule shard.
 *   9. Delete notifications addressed to this user.
 *  10. Delete barberProfiles/{uid}.
 *  11. Delete users/{uid}.
 *  12. Delete Firebase Auth (LAST).
 */
export async function deleteBarberAccount(uid: string): Promise<void> {
  const mgr = new BatchManager();

  // 1. Read barber profile to check shop membership
  const profileSnap = await getDoc(doc(db, 'barberProfiles', uid));
  const profile = profileSnap.exists() ? profileSnap.data() : null;
  const shopId: string | null = profile?.shopId || null;

  // 2. Cancel future bookings + notify clients
  const futureBookings = await getDocs(query(
    collection(db, 'bookings'),
    where('barberId', '==', uid),
    where('status', 'in', ['pending', 'confirmed'])
  ));

  for (const booking of futureBookings.docs) {
    await mgr.update(booking.ref, {
      status: 'cancelled_by_barber',
      updatedAt: Date.now(),
      cancellationReason: 'account_deleted',
    });

    const notifRef = doc(collection(db, 'notifications'));
    await mgr.set(notifRef, {
      userId: booking.data().clientId,
      type: 'booking_cancelled',
      message: 'A barber you booked has deleted their account. Your booking was cancelled.',
      bookingId: booking.id,
      read: false,
      createdAt: Date.now(),
    });
  }

  // 3. Anonymize past bookings — shop history preserved because shopId stays
  const pastBookings = await getDocs(query(
    collection(db, 'bookings'),
    where('barberId', '==', uid),
    where('status', 'in', PAST_STATUSES)
  ));

  for (const d of pastBookings.docs) {
    await mgr.update(d.ref, {
      barberId: DELETED_BARBER_ID,
      barberName: DELETED_BARBER_NAME,
    });
  }

  // 4. Delete reviews this barber received
  const receivedReviews = await getDocs(query(
    collection(db, 'reviews'),
    where('providerId', '==', uid)
  ));
  for (const d of receivedReviews.docs) {
    await mgr.delete(d.ref);
  }

  // 5. Anonymize reviews this barber left as a client
  const leftReviews = await getDocs(query(
    collection(db, 'reviews'),
    where('clientId', '==', uid)
  ));
  for (const d of leftReviews.docs) {
    await mgr.update(d.ref, {
      clientId: DELETED_USER_ID,
      clientName: DELETED_USER_NAME,
    });
  }

  // 6. Remove from shop team + notify owner. Skipped if no shop or shop gone.
  if (shopId) {
    const shopSnap = await getDoc(doc(db, 'barbershops', shopId));
    if (shopSnap.exists()) {
      const shopData = shopSnap.data();
      const barbers = (shopData.barbers || []) as string[];
      await mgr.update(doc(db, 'barbershops', shopId), {
        barbers: barbers.filter((b: string) => b !== uid),
      });

      const notifRef = doc(collection(db, 'notifications'));
      await mgr.set(notifRef, {
        userId: shopData.ownerId,
        type: 'barber_left_shop',
        message: 'A barber on your team deleted their account and was removed from your shop.',
        read: false,
        createdAt: Date.now(),
      });
    }
  }

  // 7. Delete services
  const services = await getDocs(query(
    collection(db, 'services'),
    where('providerId', '==', uid)
  ));
  for (const d of services.docs) {
    await mgr.delete(d.ref);
  }

  // 8. Delete schedule (no-op if absent — batch.delete on a non-existent doc
  //    is harmless)
  await mgr.delete(doc(db, 'schedules', `${uid}_shard_0`));

  // 9. Delete notifications
  const notifications = await getDocs(query(
    collection(db, 'notifications'),
    where('userId', '==', uid)
  ));
  for (const d of notifications.docs) {
    await mgr.delete(d.ref);
  }

  // 10. Delete barber profile
  await mgr.delete(doc(db, 'barberProfiles', uid));

  // 11. Delete user doc
  await mgr.delete(doc(db, 'users', uid));

  // Commit all Firestore changes
  await mgr.commit();

  // 12. Delete Firebase Auth (LAST)
  if (auth.currentUser) {
    await deleteUser(auth.currentUser);
  }
}

/**
 * Delete a shop-owner account. Two-phase:
 *
 *  PHASE 1 — shop teardown:
 *   1. Notify all team barbers, flip them to solo (shopId: null, isSolo: true).
 *      Their personal totalCuts on barberProfile stays intact.
 *   2. Cancel future shop bookings + notify clients.
 *   3. Anonymize past shop bookings (shopId, shopName).
 *      barberId is left UNTOUCHED so each barber's personal cut history
 *      points at their real record.
 *   4. Delete shop services.
 *   5. Delete barbershops/{shopId}.
 *
 *  PHASE 2 — owner's own barber account:
 *   6. Delegate to deleteBarberAccount(uid) which deletes the owner's
 *      barberProfile / services / schedule / user doc and the Firebase Auth
 *      user. The team-removal step inside deleteBarberAccount is auto-skipped
 *      because the shop doc no longer exists (shopSnap.exists() === false).
 */
export async function deleteShopOwnerAccount(uid: string, shopId: string): Promise<void> {
  const mgr = new BatchManager();

  // 1. Read shop to fetch its barber team
  const shopSnap = await getDoc(doc(db, 'barbershops', shopId));
  const shopBarbers: string[] = shopSnap.exists()
    ? ((shopSnap.data().barbers || []) as string[])
    : [];

  // 2. Notify each team barber + set them solo. Skip the owner — their
  //    barber doc gets handled by the deleteBarberAccount() call below.
  for (const barberId of shopBarbers) {
    if (barberId === uid) continue;

    await mgr.update(doc(db, 'barberProfiles', barberId), {
      shopId: null,
      isSolo: true,
    });

    const notifRef = doc(collection(db, 'notifications'));
    await mgr.set(notifRef, {
      userId: barberId,
      type: 'shop_deleted',
      message: 'The shop you were part of has been deleted. Your barber profile and cut count are safe. You are now a solo barber.',
      read: false,
      createdAt: Date.now(),
    });
  }

  // 3. Cancel future shop bookings + notify clients
  const futureBookings = await getDocs(query(
    collection(db, 'bookings'),
    where('shopId', '==', shopId),
    where('status', 'in', ['pending', 'confirmed'])
  ));

  for (const booking of futureBookings.docs) {
    await mgr.update(booking.ref, {
      status: 'cancelled',
      updatedAt: Date.now(),
      cancellationReason: 'shop_deleted',
    });

    const notifRef = doc(collection(db, 'notifications'));
    await mgr.set(notifRef, {
      userId: booking.data().clientId,
      type: 'booking_cancelled',
      message: 'The barbershop you booked has closed. Your booking was cancelled.',
      bookingId: booking.id,
      read: false,
      createdAt: Date.now(),
    });
  }

  // 4. Anonymize past shop bookings. barberId stays untouched so each barber's
  //    personal totalCuts history continues to reference the real booking.
  const pastBookings = await getDocs(query(
    collection(db, 'bookings'),
    where('shopId', '==', shopId),
    where('status', 'in', PAST_STATUSES)
  ));

  for (const d of pastBookings.docs) {
    await mgr.update(d.ref, {
      shopId: DELETED_SHOP_ID,
      shopName: DELETED_SHOP_NAME,
    });
  }

  // 5. Delete shop services
  const shopServices = await getDocs(query(
    collection(db, 'services'),
    where('providerId', '==', shopId)
  ));
  for (const d of shopServices.docs) {
    await mgr.delete(d.ref);
  }

  // 6. Delete shop doc itself
  await mgr.delete(doc(db, 'barbershops', shopId));

  // Commit shop-related changes
  await mgr.commit();

  // 7. Delegate owner's barber/user/Auth deletion. The team-removal step
  //    inside deleteBarberAccount is a no-op because the shop no longer
  //    exists (the if (shopSnap.exists()) check skips it).
  await deleteBarberAccount(uid);
}

/**
 * Re-authenticate the current user. Required by Firebase before deleteUser()
 * fires when the auth session is older than a few minutes.
 *
 * Routes automatically by provider:
 *   - google.com   → reauthenticateWithPopup
 *   - email/password (default) → reauthenticateWithCredential
 */
export async function reauthenticateUser(password?: string): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('No user logged in');

  const isGoogleUser = user.providerData.some(p => p.providerId === 'google.com');

  if (isGoogleUser) {
    const provider = new GoogleAuthProvider();
    await reauthenticateWithPopup(user, provider);
  } else {
    if (!password) throw new Error('Password required');
    const credential = EmailAuthProvider.credential(user.email!, password);
    await reauthenticateWithCredential(user, credential);
  }
}
