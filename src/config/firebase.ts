import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, getAuth, initializeAuth } from 'firebase/auth';
import { Firestore, getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase with guard against multiple initializations
let app: FirebaseApp;
let auth: Auth;

// Guard against multiple Firebase app initializations
try {
  app = initializeApp(firebaseConfig);
} catch (error: unknown) {
  console.error('Firebase app initialization error:', error);
  throw error;
}

// Initialize auth (persistence is handled automatically in React Native)
try {
  auth = initializeAuth(app);
} catch (error: unknown) {
  // If auth is already initialized, get the existing instance
  if (
    error &&
    typeof error === 'object' &&
    'code' in error &&
    error.code === 'auth/already-initialized'
  ) {
    auth = getAuth(app);
  } else {
    console.error('Firebase auth initialization error:', error);
    throw error;
  }
}

const db: Firestore = getFirestore(app);

export { auth, db };
