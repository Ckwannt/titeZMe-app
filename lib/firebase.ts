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
  initializeFirestore(
    app,
    { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) },
    firebaseConfig.firestoreDatabaseId
  );
} catch {
  // Persistence unavailable (private browsing, SSR, etc.) — safe to ignore
}
// Always get the named database instance — this is the guaranteed correct path
db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export { db };
export const auth = getAuth(app);
export const storage = getStorage(app);
