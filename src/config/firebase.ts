/* eslint-disable @typescript-eslint/no-explicit-any */
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase with guard against multiple initializations
let app: any;
let auth: any;

// Guard against multiple Firebase app initializations
if (!app) {
  try {
    app = initializeApp(firebaseConfig);
    console.log('✅ Firebase app initialized successfully');
  } catch (error: any) {
    console.error('❌ Firebase app initialization error:', error);
    throw error;
  }
}

// Initialize auth (persistence is handled automatically in React Native)
try {
  auth = initializeAuth(app);
  console.log('✅ Firebase auth initialized successfully');
} catch (error: any) {
  // If auth is already initialized, get the existing instance
  if (error.code === 'auth/already-initialized') {
    console.log('⚠️ Auth already initialized, using existing instance');
    auth = getAuth(app);
  } else {
    console.error('❌ Firebase auth initialization error:', error);
    throw error;
  }
}

// Initialize Firestore
const db = getFirestore(app);
console.log('✅ Firebase Firestore initialized successfully');

// Connect to emulators in development (disabled for now)
// if (__DEV__) {
//   try {
//     connectAuthEmulator(auth, 'http://localhost:9099');
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     console.log('🔧 Connected to Firebase emulators');
//   } catch (error) {
//     console.log('ℹ️ Emulators not available, using production Firebase');
//   }
// }

// Use production Firebase
console.log('🔧 Using production Firebase');

export { auth, db };
