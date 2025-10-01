import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from './FirebaseAuthService';
import {
  firebaseDataService,
  FocusSession,
  UserProgress,
  UserSettings,
  WorkoutSession,
} from './FirebaseDataService';

const STORAGE_KEYS = {
  PENDING_SESSIONS: 'pending_sessions',
  PENDING_PROGRESS: 'pending_progress',
  PENDING_SETTINGS: 'pending_settings',
};

export class SimpleOfflineService {
  // ============================================================================
  // SESSION STORAGE
  // ============================================================================

  async saveOfflineSession(session: FocusSession | WorkoutSession): Promise<void> {
    try {
      const key = 'exercises' in session ? 'workout' : 'focus';
      const existing = await this.getOfflineSessions();

      if (key === 'focus') {
        existing.focus.push(session as FocusSession);
      } else {
        existing.workout.push(session as WorkoutSession);
      }

      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SESSIONS, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save offline session:', error);
    }
  }

  async getOfflineSessions(): Promise<{ focus: FocusSession[]; workout: WorkoutSession[] }> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SESSIONS);
      return data ? JSON.parse(data) : { focus: [], workout: [] };
    } catch (error) {
      console.error('Failed to get offline sessions:', error);
      return { focus: [], workout: [] };
    }
  }

  async clearOfflineSessions(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_SESSIONS);
  }

  // ============================================================================
  // PROGRESS STORAGE
  // ============================================================================

  async saveOfflineProgress(progress: UserProgress): Promise<void> {
    try {
      const existing = await this.getOfflineProgress();
      existing.push(progress);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_PROGRESS, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save offline progress:', error);
    }
  }

  async getOfflineProgress(): Promise<UserProgress[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_PROGRESS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline progress:', error);
      return [];
    }
  }

  async clearOfflineProgress(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_PROGRESS);
  }

  // ============================================================================
  // SETTINGS STORAGE
  // ============================================================================

  async saveOfflineSettings(settings: UserSettings): Promise<void> {
    try {
      const existing = await this.getOfflineSettings();
      existing.push(settings);
      await AsyncStorage.setItem(STORAGE_KEYS.PENDING_SETTINGS, JSON.stringify(existing));
    } catch (error) {
      console.error('Failed to save offline settings:', error);
    }
  }

  async getOfflineSettings(): Promise<UserSettings[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PENDING_SETTINGS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get offline settings:', error);
      return [];
    }
  }

  async clearOfflineSettings(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEYS.PENDING_SETTINGS);
  }

  // ============================================================================
  // SYNC METHODS
  // ============================================================================

  async syncAllOfflineData(user: AuthUser): Promise<void> {
    try {
      // Sync sessions
      const sessions = await this.getOfflineSessions();
      for (const session of sessions.focus) {
        await firebaseDataService.saveFocusSession(user, session);
      }
      for (const session of sessions.workout) {
        await firebaseDataService.saveWorkoutSession(user, session);
      }
      await this.clearOfflineSessions();

      // Sync progress
      const progress = await this.getOfflineProgress();
      for (const prog of progress) {
        await firebaseDataService.updateUserProgress(user, prog);
      }
      await this.clearOfflineProgress();

      // Sync settings
      const settings = await this.getOfflineSettings();
      for (const setting of settings) {
        await firebaseDataService.saveUserSettings(user, setting);
      }
      await this.clearOfflineSettings();

      console.log('✅ All offline data synced successfully');
    } catch (error) {
      console.error('❌ Failed to sync offline data:', error);
    }
  }

  async hasOfflineData(): Promise<boolean> {
    try {
      const sessions = await this.getOfflineSessions();
      const progress = await this.getOfflineProgress();
      const settings = await this.getOfflineSettings();

      return (
        sessions.focus.length > 0 ||
        sessions.workout.length > 0 ||
        progress.length > 0 ||
        settings.length > 0
      );
    } catch (error) {
      console.error('Failed to check offline data:', error);
      return false;
    }
  }
}

export const simpleOfflineService = new SimpleOfflineService();
