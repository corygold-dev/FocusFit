import { UserDataService, UserProfile } from '@/src/services/UserDataService';
import { USER_SETTINGS_STORAGE_KEY } from '@/src/utils/constants';
import { UserSettings } from '@/src/utils/exerciseUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useAuth } from './AuthProvider';

interface UserDataContextType {
  userProfile: UserProfile | null;
  isLoading: boolean;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  recordWorkoutSession: (focusTimeMinutes: number) => Promise<void>;
  refreshProfile: () => Promise<void>;
  // User Settings (legacy compatibility)
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const UserDataContext = createContext<UserDataContextType | undefined>(undefined);

interface UserDataProviderProps {
  children: ReactNode;
}

const defaultSettings: UserSettings = {
  difficulty: 'medium',
  equipment: [],
  excludedExercises: [],
};

// Map between app difficulty and database difficulty
const mapDifficultyToDb = (difficulty: string): 'beginner' | 'intermediate' | 'advanced' => {
  switch (difficulty) {
    case 'easy':
      return 'beginner';
    case 'medium':
      return 'intermediate';
    case 'hard':
      return 'advanced';
    default:
      return 'intermediate';
  }
};

const mapDifficultyFromDb = (difficulty: 'beginner' | 'intermediate' | 'advanced'): string => {
  switch (difficulty) {
    case 'beginner':
      return 'easy';
    case 'intermediate':
      return 'medium';
    case 'advanced':
      return 'hard';
    default:
      return 'medium';
  }
};

export const UserDataProvider: React.FC<UserDataProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);

  const loadUserProfile = useCallback(async () => {
    if (!user || !isAuthenticated) {
      setUserProfile(null);
      return;
    }

    setIsLoading(true);
    try {
      let profile = await UserDataService.getUserProfile(user.userId);

      if (!profile) {
        // Create new profile for first-time user
        profile = await UserDataService.createUserProfile(
          user.userId,
          user.signInDetails?.loginId || '',
        );
      }

      setUserProfile(profile);

      // Sync settings from profile to local state
      if (profile.preferences.workout) {
        setSettings({
          difficulty: mapDifficultyFromDb(profile.preferences.workout.difficulty) as
            | 'easy'
            | 'medium'
            | 'hard',
          equipment: profile.preferences.workout.equipment,
          excludedExercises: profile.preferences.workout.excludedExercises,
        });
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user, isAuthenticated]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return;

    try {
      const updatedProfile = await UserDataService.saveUserProfile(user.userId, updates);
      setUserProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  };

  const recordWorkoutSession = async (focusTimeMinutes: number) => {
    if (!user) return;

    try {
      await UserDataService.recordWorkoutSession(user.userId, focusTimeMinutes);
      // Refresh profile to get updated stats
      await loadUserProfile();
    } catch (error) {
      console.error('Error recording workout session:', error);
      throw error;
    }
  };

  const refreshProfile = async () => {
    await loadUserProfile();
  };

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if (!user || !userProfile) return;

    try {
      // Update local state
      const updatedSettings = { ...settings, ...newSettings };
      setSettings(updatedSettings);

      // Update database
      await updateProfile({
        preferences: {
          ...userProfile.preferences,
          workout: {
            ...userProfile.preferences.workout,
            ...updatedSettings,
            difficulty: mapDifficultyToDb(updatedSettings.difficulty),
          },
        },
      });

      // Also save to AsyncStorage for offline compatibility
      await AsyncStorage.setItem(USER_SETTINGS_STORAGE_KEY, JSON.stringify(updatedSettings));
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [isAuthenticated, user, loadUserProfile]);

  return (
    <UserDataContext.Provider
      value={{
        userProfile,
        isLoading,
        updateProfile,
        recordWorkoutSession,
        refreshProfile,
        settings,
        updateSettings,
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = (): UserDataContextType => {
  const context = useContext(UserDataContext);
  if (!context) {
    throw new Error('useUserData must be used within UserDataProvider');
  }
  return context;
};
