import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  where,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { AuthUser } from './FirebaseAuthService';

export interface UserSettings {
  id: string;
  userId: string;
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  excludedExercises: string[];
  theme?: string;
  morningReminders?: boolean;
  afternoonReminders?: boolean;
  timerEndNotifications?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WorkoutSession {
  userId: string;
  sessionId: string;
  exercises: string[];
  duration?: number;
  completedAt?: Date;
}

export interface FocusSession {
  userId: string;
  sessionId: string;
  duration: number;
  completedAt: Date;
}

export interface UserProgress {
  id: string;
  userId: string;
  totalWorkouts: number;
  totalWorkoutDuration: number;
  workoutStreak: number;
  lastWorkoutDate?: Date | null;
  totalFocusSessions: number;
  totalFocusDuration: number;
  focusStreak: number;
  lastFocusSessionDate?: Date | null;
  achievements: string[];
  createdAt: string;
  updatedAt: string;
}

export class FirebaseDataService {
  // User Settings
  async getUserSettings(user: AuthUser): Promise<UserSettings | null> {
    try {
      const settingsRef = doc(db, 'userSettings', user.uid);
      const settingsSnap = await getDoc(settingsRef);

      if (settingsSnap.exists()) {
        return settingsSnap.data() as UserSettings;
      }

      return null;
    } catch (error) {
      console.error('Error getting user settings:', error);
      throw error;
    }
  }

  async saveUserSettings(user: AuthUser, settings: Partial<UserSettings>): Promise<void> {
    try {
      const settingsRef = doc(db, 'userSettings', user.uid);
      const settingsData = {
        ...settings,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      };

      await setDoc(settingsRef, settingsData, { merge: true });
    } catch (error) {
      console.error('Error saving user settings:', error);
      throw error;
    }
  }

  // User Progress
  async getUserProgress(user: AuthUser): Promise<UserProgress | null> {
    try {
      const progressRef = doc(db, 'userProgress', user.uid);
      const progressSnap = await getDoc(progressRef);

      if (progressSnap.exists()) {
        return progressSnap.data() as UserProgress;
      }

      return null;
    } catch (error) {
      console.error('Error getting user progress:', error);
      throw error;
    }
  }

  async updateUserProgress(user: AuthUser, progress: Partial<UserProgress>): Promise<void> {
    try {
      const progressRef = doc(db, 'userProgress', user.uid);
      const progressData = {
        ...progress,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      };

      await setDoc(progressRef, progressData, { merge: true });
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  // Workout Sessions
  async saveWorkoutSession(user: AuthUser, session: WorkoutSession): Promise<boolean> {
    try {
      const sessionRef = doc(db, 'workoutSession', `${user.uid}_${session.sessionId}`);
      const sessionData = {
        ...session,
        userId: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(sessionRef, sessionData);
      return true;
    } catch (error) {
      console.error('Error saving workout session:', error);
      return false;
    }
  }

  async getUserWorkoutHistory(user: AuthUser, limit: number = 50): Promise<WorkoutSession[]> {
    try {
      const sessionsRef = collection(db, 'workoutSession');
      const q = query(sessionsRef, where('userId', '==', user.uid));

      const querySnapshot = await getDocs(q);
      const sessions: WorkoutSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          userId: data.userId,
          sessionId: data.sessionId,
          exercises: data.exercises,
          duration: data.duration,
          completedAt: data.completedAt ? new Date(data.completedAt.seconds * 1000) : undefined,
        });
      });

      return sessions.slice(0, limit);
    } catch (error) {
      console.error('Error getting workout history:', error);
      return [];
    }
  }

  async saveFocusSession(user: AuthUser, session: FocusSession): Promise<boolean> {
    try {
      const sessionRef = doc(db, 'focusSessions', `${user.uid}_${session.sessionId}`);
      const sessionData = {
        ...session,
        userId: user.uid,
        completedAt: session.completedAt.toISOString(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(sessionRef, sessionData);
      return true;
    } catch (error) {
      console.error('Error saving focus session:', error);
      return false;
    }
  }

  async getUserFocusHistory(user: AuthUser, limit: number = 50): Promise<FocusSession[]> {
    try {
      const sessionsRef = collection(db, 'focusSessions');
      const q = query(sessionsRef, where('userId', '==', user.uid));

      const querySnapshot = await getDocs(q);
      const sessions: FocusSession[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sessions.push({
          userId: data.userId,
          sessionId: data.sessionId,
          duration: data.duration,
          completedAt: new Date(data.completedAt),
        });
      });

      return sessions.slice(0, limit);
    } catch (error) {
      console.error('Error getting focus history:', error);
      return [];
    }
  }

  // Initialize default settings for new users
  async initializeUserData(user: AuthUser): Promise<void> {
    try {
      // Check if user already has settings
      const existingSettings = await this.getUserSettings(user);
      if (!existingSettings) {
        // Create default settings
        await this.saveUserSettings(user, {
          difficulty: 'medium',
          equipment: [],
          excludedExercises: [],
          theme: 'system',
          morningReminders: true,
          afternoonReminders: true,
          timerEndNotifications: true,
          createdAt: new Date().toISOString(),
        });
      }

      // Check if user already has progress
      const existingProgress = await this.getUserProgress(user);
      if (!existingProgress) {
        // Create default progress
        await this.updateUserProgress(user, {
          totalWorkouts: 0,
          totalWorkoutDuration: 0,
          lastWorkoutDate: null,
          workoutStreak: 0,
          totalFocusSessions: 0,
          totalFocusDuration: 0,
          lastFocusSessionDate: null,
          focusStreak: 0,
          achievements: [],
          createdAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error('Error initializing user data:', error);
      throw error;
    }
  }
}

export const firebaseDataService = new FirebaseDataService();
