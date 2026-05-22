import { initializeApp, getApps, getApp } from 'firebase/app';
import { validateEnv } from './env';
validateEnv();
import { getAuth } from 'firebase/auth';
import { Firestore, getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
let db: Firestore;
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
  }, firebaseConfig.firestoreDatabaseId);
} catch (e: unknown) {
  // Falls back if: already initialized, browser doesn't support IndexedDB, or private browsing
  db = getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: Database ID must be explicitly set
}
export { db };
export const auth = getAuth(app);
export const storage = getStorage(app);
