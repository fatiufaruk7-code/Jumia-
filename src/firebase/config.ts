import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, Auth } from 'firebase/auth';
import { getFirestore, Firestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';
import firebaseConfigJson from '../../firebase-applet-config.json';

// Build Firebase configuration using environment variables with fallback to firebase-applet-config.json
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || firebaseConfigJson.projectId || 'jumia-34b8b',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || firebaseConfigJson.authDomain || 'jumia-34b8b.firebaseapp.com',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || firebaseConfigJson.storageBucket || 'jumia-34b8b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || firebaseConfigJson.messagingSenderId || '502463007842',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || firebaseConfigJson.appId || '1:502463007842:web:ab1e98a3f5e9f58b6b953b',
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || firebaseConfigJson.apiKey || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || firebaseConfigJson.measurementId || 'G-GBZCZJC7B8',
};

// Target Firestore Database ID as specified in configuration
export const firestoreDatabaseId: string =
  import.meta.env.VITE_FIREBASE_DATABASE_ID ||
  firebaseConfigJson.firestoreDatabaseId ||
  '(default)';

// Initialize Firebase only once
export const app: FirebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Authentication
export const auth: Auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Cloud Firestore with specified database ID
export const db: Firestore = getFirestore(app, firestoreDatabaseId);

// Initialize Firebase Storage
export const storage: FirebaseStorage = getStorage(
  app,
  `gs://${firebaseConfig.storageBucket}`
);

// Initialize Firebase Analytics if supported in this environment
export let analytics: Analytics | null = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  }).catch(() => {
    // Analytics unavailable in sandboxed/restricted iframe environment
  });
}

// Log analytics event helper
export function logAnalyticsEvent(eventName: string, params?: Record<string, any>) {
  if (analytics && typeof window !== 'undefined') {
    try {
      import('firebase/analytics').then(({ logEvent }) => {
        if (analytics) {
          logEvent(analytics, eventName, params);
        }
      });
    } catch {
      // Ignore analytics logging errors
    }
  }
}

// Mandatory testConnection function as per Firebase skill
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or database initializing.');
    }
    return false;
  }
}

// Invoke connection test on initial load
if (typeof window !== 'undefined') {
  testConnection();
}
