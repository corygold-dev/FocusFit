import AsyncStorage from '@react-native-async-storage/async-storage';
import { FirebaseApp, getApp, getApps, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
// getReactNativePersistence is not re-exported from firebase/auth in Firebase 12.
// @firebase/auth has a "react-native" export condition that Metro resolves to the
// RN bundle (dist/rn/index.js) which exports getReactNativePersistence correctly.
// TypeScript resolves to the browser types so we suppress the type error here —
// the import works correctly at runtime via Metro's react-native condition.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { getReactNativePersistence } from '@firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const environment = process.env.EXPO_PUBLIC_ENV || 'unknown';
console.log(`🔥 Firebase initializing: ${environment} environment`);
console.log(`📦 Project ID: ${firebaseConfig.projectId}`);

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  throw new Error(
    `Firebase configuration is incomplete. Make sure .env.${environment} file exists and is properly configured.`
  );
}

let app: FirebaseApp;
let auth: Auth;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  app = getApp();
  auth = getAuth(app);
}

const db: Firestore = getFirestore(app);

export { app, auth, db };
