import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  OAuthProvider,
  onAuthStateChanged,
  sendEmailVerification,
  signInWithCredential,
  signInWithEmailAndPassword,
  User,
  UserCredential,
} from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '../config/firebase';

// User-friendly error messages
const getFriendlyErrorMessage = (error: unknown): string => {
  const errorCode = (error as { code?: string })?.code || '';

  switch (errorCode) {
    // Authentication errors
    case 'auth/user-not-found':
      return 'No account found with this email address. Please check your email or create a new account.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again or reset your password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please try a different method.';

    // Registration errors
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-credential':
      return 'Invalid login credentials. Please check your email and password.';

    // Network errors
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/timeout':
      return 'Request timed out. Please try again.';

    // Google Sign-In specific
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email. Please sign in with your original method.';

    // Generic fallbacks
    default: {
      const errorMessage = (error as { message?: string })?.message || '';
      if (errorMessage.includes('network')) {
        return 'Network error. Please check your internet connection.';
      }
      if (errorMessage.includes('timeout')) {
        return 'Request timed out. Please try again.';
      }
      if (errorMessage.includes('cancelled')) {
        return 'Sign-in was cancelled.';
      }
      return 'An unexpected error occurred. Please try again.';
    }
  }
};

export interface AuthUser {
  uid: string;
  email: string | null;
}

class FirebaseAuthService {
  // Convert Firebase User to our AuthUser interface
  private convertFirebaseUser(firebaseUser: User): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
    };
  }

  // Google Sign-In
  async signInWithGoogle(): Promise<AuthUser> {
    try {
      // Configure Google Sign-In
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
        iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
      });

      // Get the users ID token
      const signInResult = await GoogleSignin.signIn();
      const idToken = signInResult.idToken;

      if (!idToken) {
        throw new Error('Google Sign-In failed - no ID token returned');
      }

      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      const result: UserCredential = await signInWithCredential(
        auth,
        googleCredential
      );

      return this.convertFirebaseUser(result.user);
    } catch (error) {
      if (
        (error as { code?: string })?.code === statusCodes.SIGN_IN_CANCELLED
      ) {
        throw new Error('SIGN_IN_CANCELLED');
      }

      console.error('Google Sign-In Error:', error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }

  // Apple Sign-In (iOS only)
  async signInWithApple(): Promise<AuthUser> {
    if (Platform.OS !== 'ios') {
      throw new Error('Apple Sign-In is only supported on iOS');
    }

    try {
      // Dynamic import for iOS only
      const { appleAuth } = await import(
        '@invertase/react-native-apple-authentication'
      );

      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        nonce: 'nonce', // Add nonce for security
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const provider = new OAuthProvider('apple.com');
      const appleCredential = provider.credential({
        idToken: identityToken,
        rawNonce: nonce,
      });

      // Sign the user in with the credential
      const result: UserCredential = await signInWithCredential(
        auth,
        appleCredential
      );

      return this.convertFirebaseUser(result.user);
    } catch (error) {
      if ((error as { code?: string })?.code === '1001') {
        throw new Error('SIGN_IN_CANCELLED');
      }

      console.error('Apple Sign-In Error:', error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }

  // Email/Password Sign-In
  async signInWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AuthUser> {
    try {
      const result: UserCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      return this.convertFirebaseUser(result.user);
    } catch (error) {
      console.error('Email/Password Sign-In Error:', error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }

  // Email/Password Registration
  async createUserWithEmailAndPassword(
    email: string,
    password: string
  ): Promise<AuthUser> {
    try {
      const result: UserCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Send email verification
      if (result.user) {
        await sendEmailVerification(result.user);
      }

      return this.convertFirebaseUser(result.user);
    } catch (error) {
      console.error('Email/Password Registration Error:', error);
      throw new Error(getFriendlyErrorMessage(error));
    }
  }

  // Sign Out
  async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign Out Error:', error);
      throw error;
    }
  }

  // Delete Account
  async deleteAccount(): Promise<void> {
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('No user is currently signed in');
      }

      // Delete user data from Firestore
      await this.deleteUserData(user.uid);

      // Delete the user account
      await user.delete();
    } catch (error) {
      console.error('Delete Account Error:', error);
      throw error;
    }
  }

  // Delete all user data from Firestore
  private async deleteUserData(userId: string): Promise<void> {
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const { db } = await import('../config/firebase');

      // Delete user progress
      const userProgressRef = doc(db, 'userProgress', userId);
      await deleteDoc(userProgressRef);

      // Delete user settings
      const userSettingsRef = doc(db, 'userSettings', userId);
      await deleteDoc(userSettingsRef);

      // Delete user workout history
      const workoutHistoryRef = doc(db, 'userWorkoutHistory', userId);
      await deleteDoc(workoutHistoryRef);

      // Delete user focus sessions
      const focusSessionsRef = doc(db, 'userFocusSessions', userId);
      await deleteDoc(focusSessionsRef);
    } catch (error) {
      console.error('Error deleting user data:', error);
    }
  }

  // Auth State Listener
  onAuthStateChanged(callback: (user: AuthUser | null) => void): () => void {
    return onAuthStateChanged(auth, firebaseUser => {
      if (firebaseUser) {
        callback(this.convertFirebaseUser(firebaseUser));
      } else {
        callback(null);
      }
    });
  }
}

export default new FirebaseAuthService();
