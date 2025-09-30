import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import firebaseAuthService, { AuthUser } from '../services/FirebaseAuthService';
import {
  firebaseDataService,
  FocusSession,
  UserProgress,
  UserSettings,
  WorkoutSession,
} from '../services/FirebaseDataService';

// ============================================================================
// AUTH CONTEXT
// ============================================================================

interface AuthContextType {
  // Auth state
  user: AuthUser | null | undefined;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Auth methods
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  sendEmailVerification: () => Promise<void>;
  clearError: () => void;
  logout: () => Promise<void>;

  // Data persistence
  isOnline: boolean;
  isSyncing: boolean;
  lastSyncTime: Date | null;
  settings: UserSettings | null;

  // Data methods
  saveUserSettings: (settings: Partial<UserSettings>) => Promise<void>;
  saveUserProgress: (progress: Partial<UserProgress>) => Promise<void>;
  saveWorkoutSession: (session: Omit<WorkoutSession, 'userId'>) => Promise<void>;
  saveFocusSession: (session: Omit<FocusSession, 'userId'>) => Promise<void>;
  getUserWorkoutHistory: () => Promise<WorkoutSession[]>;
  getUserFocusHistory: () => Promise<FocusSession[]>;

  // Subscription
  subscription: 'free' | 'premium' | null;
  isPremium: boolean;
  refreshSubscription: () => Promise<void>;
  upgradeToPremium: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================================================
// AUTH PROVIDER
// ============================================================================

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Auth state - using undefined to indicate "loading" state
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data state
  const [isOnline] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [settings, setSettings] = useState<UserSettings | null>(null);

  // Use ref to track synced user without causing re-renders
  const syncedUserUidRef = useRef<string | null>(null);

  // Subscription state
  const [subscription, setSubscription] = useState<'free' | 'premium' | null>(null);

  // Note: Multiple instance check moved to end to avoid conditional hooks

  const isAuthenticated = user !== null && user !== undefined;
  const isPremium = subscription === 'premium';

  // ============================================================================
  // AUTH METHODS
  // ============================================================================

  const loginWithGoogle = useCallback(async () => {
    try {
      setError(null);
      await firebaseAuthService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google login failed');
      throw err;
    }
  }, []);

  const loginWithApple = useCallback(async () => {
    try {
      setError(null);
      await firebaseAuthService.signInWithApple();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Apple login failed');
      throw err;
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await firebaseAuthService.signInWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    try {
      setError(null);
      await firebaseAuthService.createUserWithEmailAndPassword(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  }, []);

  const sendEmailVerification = useCallback(async () => {
    try {
      setError(null);
      // Email verification not implemented
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Email verification failed');
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setError(null);
      await firebaseAuthService.signOut();
      setUser(null);
      setSettings(null);
      setSubscription(null);
      syncedUserUidRef.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Logout failed');
      throw err;
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  // ============================================================================
  // DATA METHODS
  // ============================================================================

  const syncUserData = useCallback(async (userToSync: AuthUser) => {
    // Check if this user's data has already been synced
    if (syncedUserUidRef.current === userToSync.uid) {
      return;
    }
    setIsSyncing(true);

    try {
      // Set default values without Firestore
      setSettings(null);
      setSubscription('free');
      setLastSyncTime(new Date());

      // Mark this user as synced using ref (no re-render)
      syncedUserUidRef.current = userToSync.uid;
    } catch (err) {
      console.error('💾 AuthProvider: Failed to sync user data:', err);
      // Still mark as synced to prevent infinite retries
      syncedUserUidRef.current = userToSync.uid;
    } finally {
      setIsSyncing(false);
    }
  }, []);

  const saveUserSettings = useCallback(
    async (newSettings: Partial<UserSettings>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        await firebaseDataService.saveUserSettings(user, newSettings);
        setSettings((prev) => ({ ...prev, ...newSettings }) as UserSettings);
      } catch (err) {
        console.error('💾 AuthProvider: Failed to save user settings:', err);
        throw err;
      }
    },
    [user],
  );

  const saveUserProgress = useCallback(
    async (progress: Partial<UserProgress>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        await firebaseDataService.updateUserProgress(user, progress);
      } catch (err) {
        console.error('💾 AuthProvider: Failed to save user progress:', err);
        throw err;
      }
    },
    [user],
  );

  const saveWorkoutSession = useCallback(
    async (session: Omit<WorkoutSession, 'userId'>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const fullSession: WorkoutSession = {
          ...session,
          userId: user.uid,
        };
        await firebaseDataService.saveWorkoutSession(user, fullSession);
      } catch (err) {
        console.error('💾 AuthProvider: Failed to save workout session:', err);
        throw err;
      }
    },
    [user],
  );

  const saveFocusSession = useCallback(
    async (session: Omit<FocusSession, 'userId'>) => {
      if (!user) throw new Error('User not authenticated');

      try {
        const fullSession: FocusSession = {
          ...session,
          userId: user.uid,
        };
        await firebaseDataService.saveFocusSession(user, fullSession);
      } catch (err) {
        console.error('💾 AuthProvider: Failed to save focus session:', err);
        throw err;
      }
    },
    [user],
  );

  const getUserWorkoutHistory = useCallback(async (): Promise<WorkoutSession[]> => {
    if (!user) throw new Error('User not authenticated');
    return firebaseDataService.getUserWorkoutHistory(user);
  }, [user]);

  const getUserFocusHistory = useCallback(async (): Promise<FocusSession[]> => {
    if (!user) throw new Error('User not authenticated');
    return firebaseDataService.getUserFocusHistory(user);
  }, [user]);

  // ============================================================================
  // SUBSCRIPTION METHODS
  // ============================================================================

  const refreshSubscription = useCallback(async () => {
    // For now, default to free tier
    // Default to free tier
    setSubscription('free');
  }, []);

  const upgradeToPremium = useCallback(async (): Promise<boolean> => {
    // Premium upgrade not implemented
    return false;
  }, []);

  // ============================================================================
  // EFFECTS
  // ============================================================================

  useEffect(() => {
    const unsubscribe = firebaseAuthService.onAuthStateChanged((authUser) => {
      setUser(authUser);
      setIsLoading(false);

      // Reset sync tracking when user changes
      if (!authUser || authUser.uid !== syncedUserUidRef.current) {
        syncedUserUidRef.current = null;
      }
    });

    // Timeout to ensure loading state doesn't get stuck
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    // Only sync if user is authenticated, not currently syncing, and hasn't been synced yet
    if (isAuthenticated && user && syncedUserUidRef.current !== user.uid && !isSyncing) {
      syncUserData(user);
    }
    // Note: isLoading is set to false in the auth state change listener
  }, [isAuthenticated, user, isSyncing, syncUserData]);

  // ============================================================================
  // MEMOIZED CONTEXT VALUE (Gemini's recommendation)
  // ============================================================================

  const value: AuthContextType = useMemo(
    () => ({
      // Auth state
      user,
      isAuthenticated,
      isLoading,
      error,

      // Auth methods
      loginWithGoogle,
      loginWithApple,
      login,
      register,
      sendEmailVerification,
      clearError,
      logout,

      // Data state
      isOnline,
      isSyncing,
      lastSyncTime,
      settings,

      // Data methods
      saveUserSettings,
      saveUserProgress,
      saveWorkoutSession,
      saveFocusSession,
      getUserWorkoutHistory,
      getUserFocusHistory,

      // Subscription
      subscription,
      isPremium,
      refreshSubscription,
      upgradeToPremium,
    }),
    [
      user,
      isAuthenticated,
      isLoading,
      error,
      isOnline,
      isSyncing,
      lastSyncTime,
      settings,
      subscription,
      isPremium,
      loginWithGoogle,
      loginWithApple,
      login,
      register,
      sendEmailVerification,
      clearError,
      logout,
      saveUserSettings,
      saveUserProgress,
      saveWorkoutSession,
      saveFocusSession,
      getUserWorkoutHistory,
      getUserFocusHistory,
      refreshSubscription,
      upgradeToPremium,
    ],
  );

  // ============================================================================
  // RENDER PROVIDER (always render context, but conditionally render children)
  // ============================================================================

  return <AuthContext.Provider value={value}>{isLoading ? null : children}</AuthContext.Provider>;
};

// ============================================================================
// HOOKS
// ============================================================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Legacy hooks for backward compatibility
export const useBackendData = () => {
  const auth = useAuth();
  return {
    isOnline: auth.isOnline,
    isSyncing: auth.isSyncing,
    lastSyncTime: auth.lastSyncTime,
    settings: auth.settings,
    saveUserSettings: auth.saveUserSettings,
    saveUserProgress: auth.saveUserProgress,
    saveWorkoutSession: auth.saveWorkoutSession,
    saveFocusSession: auth.saveFocusSession,
    getUserWorkoutHistory: auth.getUserWorkoutHistory,
    getUserFocusHistory: auth.getUserFocusHistory,
  };
};

export const useUserSettings = () => {
  const auth = useAuth();
  return {
    settings: auth.settings,
    saveUserSettings: auth.saveUserSettings,
  };
};

export const useSubscription = () => {
  const auth = useAuth();
  return {
    subscription: auth.subscription,
    isPremium: auth.isPremium,
    refreshSubscription: auth.refreshSubscription,
    upgradeToPremium: auth.upgradeToPremium,
  };
};
