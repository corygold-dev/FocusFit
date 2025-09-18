import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AuthUser,
  confirmSignUp,
  ConfirmSignUpOutput,
  fetchAuthSession,
  getCurrentUser,
  signIn,
  SignInOutput,
  signOut,
  signUp,
  SignUpOutput,
} from 'aws-amplify/auth';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';

interface AuthError extends Error {
  message: string;
  code?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => Promise<AuthUser>;
  register: (email: string, password: string) => Promise<SignUpOutput>;
  confirmRegistration: (email: string, code: string) => Promise<ConfirmSignUpOutput>;
  logout: () => Promise<void>;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error('login not implemented');
  },
  register: async () => {
    throw new Error('register not implemented');
  },
  confirmRegistration: async () => {
    throw new Error('confirmRegistration not implemented');
  },
  logout: async () => {
    throw new Error('logout not implemented');
  },
  error: null,
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => {
    setError(null);
  };

  const checkAuthState = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (emailOrPhone: string, password: string): Promise<AuthUser> => {
    try {
      setError(null);

      console.log(`Login attempt for: ${emailOrPhone}`);

      // Use a simpler approach for mobile
      const signInResult = await signIn({
        username: emailOrPhone,
        password,
      });

      console.log('Sign in result:', signInResult);

      if (signInResult.isSignedIn) {
        // Get user but with error handling
        try {
          const currentUser = await getCurrentUser();
          setUser(currentUser);
          return currentUser;
        } catch (userError) {
          console.error('Error getting current user:', userError);
          // Create a basic user object if getCurrentUser fails
          const basicUser = {
            userId: emailOrPhone,
            username: emailOrPhone,
          } as AuthUser;
          setUser(basicUser);
          return basicUser;
        }
      }

      throw new Error('Login failed: User not signed in');
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error';
      console.error('Login error:', errorMsg);

      // Mobile-specific error handling
      if (Platform.OS !== 'web') {
        setError('Login failed. Please try again or use the web version.');
      } else {
        // Your existing web error handling
        setError(errorMsg);
      }

      throw err;
    }
  };

  const register = async (email: string, password: string): Promise<SignUpOutput> => {
    try {
      setError(null);
      const signUpOutput: SignUpOutput = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      return signUpOutput;
    } catch (err) {
      const authError = err as AuthError;

      if (authError.code === 'UsernameExistsException') {
        setError('An account with this email already exists. Please log in instead.');
      } else if (authError.code === 'InvalidPasswordException') {
        setError('Password does not meet requirements. Please use a stronger password.');
      } else if (authError.message?.includes('password')) {
        setError('Password issue: ' + authError.message);
      } else if (authError.message?.includes('email')) {
        setError('Email issue: ' + authError.message);
      } else {
        setError(authError.message || 'Failed to sign up. Please try again.');
      }

      throw authError;
    }
  };

  const confirmRegistration = async (email: string, code: string): Promise<ConfirmSignUpOutput> => {
    try {
      setError(null);
      const confirmSignUpOutput: ConfirmSignUpOutput = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return confirmSignUpOutput;
    } catch (err) {
      const authError = err as AuthError;

      if (authError.code === 'CodeMismatchException') {
        setError('Invalid verification code. Please try again.');
      } else if (authError.code === 'ExpiredCodeException') {
        setError('Verification code has expired. Please request a new one.');
      } else if (authError.code === 'UserNotFoundException') {
        setError('No account found with this email.');
      } else if (
        authError.message?.includes('confirmation') ||
        authError.message?.includes('code')
      ) {
        setError(authError.message);
      } else {
        setError(authError.message || 'Failed to confirm registration');
      }

      throw authError;
    }
  };

  const logout = async (): Promise<void> => {
    console.log('AuthProvider: logout function called'); // Debug log
    try {
      setError(null);
      console.log('AuthProvider: calling signOut'); // Debug log
      await signOut();
      console.log('AuthProvider: signOut successful'); // Debug log
      setUser(null);
    } catch (err) {
      const authError = err as AuthError;
      console.error('AuthProvider: signOut error', authError); // Debug log
      setError(authError.message || 'Failed to sign out');
      throw authError;
    }
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  const authContextValue: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    confirmRegistration,
    logout,
    error,
    clearError,
  };

  return <AuthContext.Provider value={authContextValue}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
