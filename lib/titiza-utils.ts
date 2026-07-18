// Titiza first-meeting persistence helpers.
//
// Source of truth is the `titiza` map on the user document:
//
//   titiza: {
//     hasMet: boolean
//     firstMetAt: Timestamp   // set once, on the very first meeting
//     lastVisitAt: Timestamp  // bumped every visit
//     introVersion: number    // which intro sequence the user has seen
//   }
//
// Field absence === hasMet false. No migration/backfill is required.
//
// These writes go straight through updateDoc (not userUpdateSchema) because
// they carry serverTimestamp() sentinels, which the Zod schema cannot parse.
// firestore.rules allows them under the users self-update path — isValidUser()
// uses hasAll (not hasOnly), so an extra `titiza` map on an otherwise-valid
// user document passes.

import {
  doc,
  getDoc,
  updateDoc,
  serverTimestamp,
  type FieldValue,
} from 'firebase/firestore';
import { db } from './firebase';

const CURRENT_INTRO_VERSION = 1;

/**
 * Mark that the user has now met Titiza. Called once, when the genesis
 * "Let's Begin" CTA is pressed.
 *
 *   - hasMet        → true
 *   - firstMetAt    → serverTimestamp() ONLY if not already set
 *   - lastVisitAt   → serverTimestamp()
 *   - introVersion  → 1
 *
 * Uses dot-path field updates so sibling keys inside the `titiza` map are
 * preserved rather than clobbered.
 */
export async function markTitizaMet(uid: string): Promise<void> {
  if (!uid) return;
  try {
    const ref = doc(db, 'users', uid);

    // firstMetAt is immutable once written — only set it the first time.
    let firstMetAlreadySet = false;
    try {
      const snap = await getDoc(ref);
      firstMetAlreadySet = !!snap.data()?.titiza?.firstMetAt;
    } catch {
      // If the read fails we fall through and set firstMetAt — a best-effort
      // timestamp is better than none for a brand-new meeting.
    }

    const updates: Record<string, boolean | number | FieldValue> = {
      'titiza.hasMet': true,
      'titiza.lastVisitAt': serverTimestamp(),
      'titiza.introVersion': CURRENT_INTRO_VERSION,
    };
    if (!firstMetAlreadySet) {
      updates['titiza.firstMetAt'] = serverTimestamp();
    }

    await updateDoc(ref, updates);
  } catch (error) {
    // Non-fatal: the intro still played, we just failed to record it. It will
    // be retried on the next visit's markTitizaMet / next Let's Begin press.
    console.error('markTitizaMet failed:', error);
  }
}

/**
 * Bump lastVisitAt on a repeat visit (user has already met Titiza). Touches
 * only lastVisitAt — nothing else in the titiza map changes.
 */
export async function touchTitizaVisit(uid: string): Promise<void> {
  if (!uid) return;
  try {
    await updateDoc(doc(db, 'users', uid), {
      'titiza.lastVisitAt': serverTimestamp(),
    });
  } catch (error) {
    console.error('touchTitizaVisit failed:', error);
  }
}
