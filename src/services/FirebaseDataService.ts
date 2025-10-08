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
import { Alert } from 'react-native';
import { db } from '../config/firebase';
import { checkAchievements, getAchievementById, UserProgressData } from '../utils/achievements';
import { AuthUser } from './index';

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
  lastFocusTime?: number;
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
  workoutStreak: number;
  lastWorkoutDate?: Date | null;
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
      const currentProgress = await this.getUserProgress(user);
      const updatedProgress = {
        ...currentProgress,
        ...progress,
        userId: user.uid,
        updatedAt: serverTimestamp(),
      };

      const [totalWorkouts, totalFocusSessions, totalWorkoutDuration, totalFocusDuration] =
        await Promise.all([
          this.getTotalWorkouts(user),
          this.getTotalFocusSessions(user),
          this.getTotalWorkoutDuration(user),
          this.getTotalFocusDuration(user),
        ]);

      const progressForAchievements: UserProgressData = {
        totalWorkouts,
        totalFocusSessions,
        totalWorkoutDuration,
        totalFocusDuration,
        workoutStreak: updatedProgress.workoutStreak || 0,
        focusStreak: updatedProgress.focusStreak || 0,
      };

      const newAchievements = checkAchievements(
        progressForAchievements,
        currentProgress?.achievements || [],
      );

      if (newAchievements.length > 0) {
        updatedProgress.achievements = [
          ...(currentProgress?.achievements || []),
          ...newAchievements,
        ];

        const firstAchievement = getAchievementById(newAchievements[0]);
        const achievementText =
          newAchievements.length === 1
            ? `${firstAchievement?.emoji} ${firstAchievement?.name}`
            : `${firstAchievement?.emoji} ${firstAchievement?.name} +${newAchievements.length - 1} more`;

        Alert.alert('🏆 Achievement Unlocked!', achievementText, [
          { text: 'Awesome!', style: 'default' },
        ]);
      }

      const progressRef = doc(db, 'userProgress', user.uid);
      await setDoc(progressRef, updatedProgress, { merge: true });
    } catch (error) {
      console.error('Error updating user progress:', error);
      throw error;
    }
  }

  async updateStreaks(user: AuthUser, activityType: 'workout' | 'focus'): Promise<void> {
    try {
      const currentProgress = await this.getUserProgress(user);
      if (!currentProgress) return;

      const lastActivityDate =
        activityType === 'workout'
          ? currentProgress.lastWorkoutDate
          : currentProgress.lastFocusSessionDate;

      const currentStreak =
        activityType === 'workout'
          ? currentProgress.workoutStreak || 0
          : currentProgress.focusStreak || 0;

      const newStreak = this.calculateStreak(currentStreak, lastActivityDate);

      const updateData =
        activityType === 'workout' ? { workoutStreak: newStreak } : { focusStreak: newStreak };

      await this.updateUserProgress(user, updateData);
    } catch (error) {
      console.error('Error updating streaks:', error);
      throw error;
    }
  }

  calculateStreak(
    currentStreak: number,
    lastActivityDate: Date | null | undefined,
    newActivityDate: Date = new Date(),
  ): number {
    // If no previous activity, start with streak of 1
    if (!lastActivityDate) return 1;

    const today = new Date(newActivityDate);
    today.setHours(0, 0, 0, 0);

    const lastActivity = new Date(lastActivityDate);
    lastActivity.setHours(0, 0, 0, 0);

    const daysDiff = Math.floor((today.getTime() - lastActivity.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff === 0) {
      // Already logged today → no change
      return currentStreak;
    } else if (daysDiff === 1) {
      // Consecutive day → increase streak
      return currentStreak + 1;
    } else {
      // Missed a day or more → reset streak
      return 1;
    }
  }

  async getTotalWorkouts(user: AuthUser): Promise<number> {
    const sessions = await this.getUserWorkoutHistory(user);
    return sessions.length;
  }

  async getTotalFocusSessions(user: AuthUser): Promise<number> {
    const sessions = await this.getUserFocusHistory(user);
    return sessions.length;
  }

  async getTotalWorkoutDuration(user: AuthUser): Promise<number> {
    const sessions = await this.getUserWorkoutHistory(user);
    return sessions.reduce((total, session) => total + (session.duration || 0), 0);
  }

  async getTotalFocusDuration(user: AuthUser): Promise<number> {
    const sessions = await this.getUserFocusHistory(user);
    return sessions.reduce((total, session) => total + session.duration, 0);
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
      const sessionRef = doc(db, 'focusSession', `${user.uid}_${session.sessionId}`);
      const sessionData = {
        ...session,
        userId: user.uid,
        completedAt: serverTimestamp(),
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
      const sessionsRef = collection(db, 'focusSession');
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
          lastFocusTime: 1500,
          createdAt: new Date().toISOString(),
        });
      }

      // Check if user already has progress
      const existingProgress = await this.getUserProgress(user);
      if (!existingProgress) {
        // Create default progress
        await this.updateUserProgress(user, {
          lastWorkoutDate: null,
          workoutStreak: 0,
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
