import { initializeApp, getApps, getApp } from 'firebase/app';
import { validateEnv } from './env';
validateEnv();
import { getAuth } from 'firebase/auth';
import { getFirestore, initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from '../firebase-applet-config.json';

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = !getApps().length 
  ? initializeFirestore(app, { localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() }) }, firebaseConfig.firestoreDatabaseId) 
  : getFirestore(app, firebaseConfig.firestoreDatabaseId); // CRITICAL: Database ID must be explicitly set
export const auth = getAuth(app);
export const storage = getStorage(app);
