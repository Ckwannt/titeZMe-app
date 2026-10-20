/**
 * Firebase Admin SDK — server-only.
 * Never import this in 'use client' files.
 */
import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { isIsolatedPreview } from './preview-boundary';

function getAdminApp(): App {
  const existingApps = getApps();
  if (existingApps.length > 0) return existingApps[0];

  // If explicit service account credentials are set, use them.
  // Otherwise fall back to Application Default Credentials (ADC),
  // which work in Cloud Run / Firebase-hosted environments.
  if (process.env.FIREBASE_ADMIN_PRIVATE_KEY) {
    return initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
        clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY.replace(/\\n/g, '\n'),
      }),
    });
  }

  return initializeApp();
}

export const adminDb = isIsolatedPreview()
  ? new Proxy({} as ReturnType<typeof getFirestore>, {
    get() { throw new Error('Firebase Admin is unavailable in isolated previews'); },
  })
  : getFirestore(getAdminApp(), 'titezme-prod');
