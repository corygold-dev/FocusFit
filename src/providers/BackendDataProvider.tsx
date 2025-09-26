import { useAuth } from '@/src/providers/AuthProvider';
import {
  UserDataService,
  type UserProgress,
  type UserSettings,
} from '@/src/services/UserDataService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { LOCAL_STORAGE_KEYS } from '../utils/constants';

interface BackendDataContextType {
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  syncUserData: () => Promise<void>;
  saveUserSettings: (settings: UserSettings) => Promise<boolean>;
  saveUserProgress: (
    progress: Omit<UserProgress, 'workoutStreak' | 'focusStreak'>,
  ) => Promise<boolean>;
  settings: UserSettings | null;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<boolean>;
  isLoading: boolean;
}

const BackendDataContext = createContext<BackendDataContextType | undefined>(undefined);

interface BackendDataProviderProps {
  children: ReactNode;
}

export const BackendDataProvider: React.FC<BackendDataProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [isOnline, setIsOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSyncedThisSession, setHasSyncedThisSession] = useState(false);

  useEffect(() => {
    setIsOnline(true);
  }, []);

  const syncUserData = useCallback(async () => {
    if (!user?.userId || isSyncing) return;

    setIsSyncing(true);
    try {
      const localSettings = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
      if (localSettings) {
        const settings = JSON.parse(localSettings);
        await UserDataService.saveUserSettings(user.userId, settings);
      }

      const localProgress = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.USER_PROGRESS);
      if (localProgress) {
        const progress = JSON.parse(localProgress);
        await UserDataService.updateUserProgress(user.userId, progress);
      }

      const now = new Date();
      setLastSyncTime(now);
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, now.toISOString());
    } catch {
      // Silent fail for sync errors
    } finally {
      setIsSyncing(false);
    }
  }, [user?.userId, isSyncing]);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const lastSync = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.LAST_SYNC);
        if (lastSync) {
          setLastSyncTime(new Date(lastSync));
        }

        const localSettings = await AsyncStorage.getItem(LOCAL_STORAGE_KEYS.USER_SETTINGS);
        if (localSettings) {
          setSettings(JSON.parse(localSettings));
        } else {
          const defaultSettings: UserSettings = {
            difficulty: 'medium',
            equipment: [],
            excludedExercises: [],
            theme: 'system',
            morningReminders: true,
            afternoonReminders: true,
            timerEndNotifications: true,
          };
          setSettings(defaultSettings);
        }
      } catch {
        setSettings({
          difficulty: 'medium',
          equipment: [],
          excludedExercises: [],
          theme: 'system',
          morningReminders: true,
          afternoonReminders: true,
          timerEndNotifications: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?.userId && isOnline && !isSyncing && !hasSyncedThisSession) {
      syncUserData();
      setHasSyncedThisSession(true);
    }
  }, [isAuthenticated, user?.userId, isOnline, isSyncing, hasSyncedThisSession, syncUserData]);

  const saveUserSettings = async (settings: UserSettings): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(settings));

      if (isOnline && isAuthenticated && user?.userId) {
        const success = await UserDataService.saveUserSettings(user.userId, settings);
        if (success) {
          const now = new Date();
          setLastSyncTime(now);
          await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, now.toISOString());
        }
        return success;
      }

      return true;
    } catch {
      return false;
    }
  };

  const saveUserProgress = async (
    progress: Omit<UserProgress, 'workoutStreak' | 'focusStreak'>,
  ): Promise<boolean> => {
    try {
      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));

      if (isOnline && isAuthenticated && user?.userId) {
        const success = await UserDataService.updateUserProgress(user.userId, progress);
        if (success) {
          const now = new Date();
          setLastSyncTime(now);
          await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, now.toISOString());
        }
        return success;
      }

      return true;
    } catch {
      return false;
    }
  };

  const updateSettings = async (newSettings: Partial<UserSettings>): Promise<boolean> => {
    if (!settings) {
      return false;
    }

    try {
      const updatedSettings = { ...settings, ...newSettings };

      if ('notifications' in updatedSettings) {
        delete updatedSettings.notifications;
      }

      setSettings(updatedSettings);

      await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.USER_SETTINGS, JSON.stringify(updatedSettings));

      if (isOnline && isAuthenticated && user?.userId) {
        const success = await UserDataService.saveUserSettings(user.userId, updatedSettings);
        if (success) {
          const now = new Date();
          setLastSyncTime(now);
          await AsyncStorage.setItem(LOCAL_STORAGE_KEYS.LAST_SYNC, now.toISOString());
        }
        return success;
      }

      return true;
    } catch {
      return false;
    }
  };

  return (
    <BackendDataContext.Provider
      value={{
        isOnline,
        isSyncing,
        lastSyncTime,
        syncUserData,
        saveUserSettings,
        saveUserProgress,
        settings,
        updateSettings,
        isLoading,
      }}
    >
      {children}
    </BackendDataContext.Provider>
  );
};

export const useBackendData = (): BackendDataContextType => {
  const context = useContext(BackendDataContext);
  if (!context) {
    throw new Error('useBackendData must be used within BackendDataProvider');
  }
  return context;
};

export const useUserSettings = () => {
  const { settings, updateSettings, isLoading } = useBackendData();
  return { settings, updateSettings, isLoading };
};
