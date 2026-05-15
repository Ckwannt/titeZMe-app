import { doc, runTransaction } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/**
 * After a booking is cancelled, remove its slot from the bookingLocks document
 * so that slot becomes bookable again.
 */
export async function cleanupBookingLock(booking: {
  barberId: string;
  date: string;
  startTime: string;
  endTime?: string;
  id: string;
}): Promise<void> {
  const lockDocRef = doc(db, 'bookingLocks', `${booking.barberId}_${booking.date}`);
  try {
    await runTransaction(db, async (t) => {
      const lockDoc = await t.get(lockDocRef);
      if (!lockDoc.exists()) return;

      const slots: any[] = lockDoc.data().slots || [];
      const updatedSlots = slots.filter((s: any) => s.bookingId !== booking.id);

      if (updatedSlots.length === 0) {
        t.delete(lockDocRef);
      } else {
        t.update(lockDocRef, { slots: updatedSlots });
      }
    });
  } catch (e) {
    // Non-critical — don't throw, just log
    console.error('Failed to clean booking lock:', e);
  }
}
