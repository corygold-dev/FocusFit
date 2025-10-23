import { GoogleSignin } from '@react-native-google-signin/google-signin';
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

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

class FirebaseAuthService {
  // Convert Firebase User to our AuthUser interface
  private convertFirebaseUser(firebaseUser: User): AuthUser {
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
      isAnonymous: firebaseUser.isAnonymous,
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
      console.error('Google Sign-In Error:', error);
      throw error;
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
      console.error('Apple Sign-In Error:', error);
      throw error;
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
      throw error;
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
      throw error;
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
