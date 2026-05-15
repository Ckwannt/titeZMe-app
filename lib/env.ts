/**
 * Environment variable validation for titeZMe.
 *
 * This project currently uses firebase-applet-config.json for Firebase config.
 * validateEnv() logs a warning when env vars aren't set but does NOT throw,
 * so the JSON-config path keeps working. If you migrate to env vars, change
 * the console.warn to throw new Error(...).
 */

const required = [
  'NEXT_PUBLIC_FIREBASE_API_KEY',
  'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
  'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET',
  'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID',
  'NEXT_PUBLIC_FIREBASE_APP_ID',
];

export function validateEnv(): void {
  // Skip validation during Next.js static build analysis
  if (typeof window === 'undefined') return;

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    // Only warn — project uses firebase-applet-config.json as the config source
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[titeZMe] Firebase env vars not set (using JSON config instead):\n' +
          missing.join('\n')
      );
    }
  }
}

export const env = {
  firebase: {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  },
};
