import {
  signIn,
  signUp,
  confirmSignUp,
  signOut,
  getCurrentUser,
  fetchAuthSession,
  type AuthUser,
  type SignInOutput,
  type SignUpOutput,
  type ConfirmSignUpOutput,
} from 'aws-amplify/auth';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AmplifyErrorWithCode extends Error {
  code: string;
}

function isAmplifyErrorWithCode(error: unknown): error is AmplifyErrorWithCode {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as Record<string, unknown>).code === 'string'
  );
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
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

  const clearError = () => setError(null);

  const refreshAuthState = async (): Promise<void> => {
    try {
      const { tokens } = await fetchAuthSession();
      if (tokens) {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return;
      }
      setUser(null);
    } catch {
      console.log('No authenticated user found');
      setUser(null);
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      setIsLoading(true);
      try {
        await refreshAuthState();
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email: string, password: string): Promise<AuthUser> => {
    try {
      setIsLoading(true);
      clearError();
      console.log(`Login attempt for: ${email}`);

      const signInResult: SignInOutput = await signIn({
        username: email,
        password,
      });

      if (signInResult.isSignedIn) {
        console.log('Sign in successful');
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        return currentUser;
      }

      if (signInResult.nextStep) {
        console.log('Additional sign-in steps required:', signInResult.nextStep.signInStep);
        throw new Error(`Additional sign-in steps required: ${signInResult.nextStep.signInStep}`);
      }

      throw new Error('Login failed');
    } catch (err: unknown) {
      console.error('Login error:', err);

      if (isAmplifyErrorWithCode(err)) {
        if (err.code === 'UserNotConfirmedException') {
          setError('Please verify your email address before logging in.');
        } else if (err.code === 'NotAuthorizedException') {
          setError('Incorrect username or password.');
        } else if (err.code === 'UserNotFoundException') {
          setError('No account found with this email.');
        } else if (err.code === 'LimitExceededException') {
          setError('Too many failed login attempts. Please try again later.');
        } else {
          setError(err.message || 'Failed to sign in. Please try again.');
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
        setError(errorMessage);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string): Promise<SignUpOutput> => {
    try {
      setIsLoading(true);
      clearError();

      const result: SignUpOutput = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      console.log('Registration successful, confirmation required');
      return result;
    } catch (err: unknown) {
      console.error('Registration error:', err);

      if (isAmplifyErrorWithCode(err)) {
        if (err.code === 'UsernameExistsException') {
          setError('An account with this email already exists.');
        } else if (err.code === 'InvalidPasswordException') {
          setError('Password does not meet requirements. Please use a stronger password.');
        } else if (err.code === 'InvalidParameterException' && err.message.includes('email')) {
          setError('Please provide a valid email address.');
        } else {
          setError(err.message || 'Failed to register. Please try again.');
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to register';
        setError(errorMessage);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmRegistration = async (email: string, code: string): Promise<ConfirmSignUpOutput> => {
    try {
      setIsLoading(true);
      clearError();

      const result: ConfirmSignUpOutput = await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      if (result.isSignUpComplete) {
        try {
          await refreshAuthState();
        } catch (e) {
          console.log('Auto-login after confirmation failed', e);
        }
      }

      return result;
    } catch (err: unknown) {
      console.error('Confirmation error:', err);

      if (isAmplifyErrorWithCode(err)) {
        if (err.code === 'CodeMismatchException') {
          setError('Invalid verification code. Please try again.');
        } else if (err.code === 'ExpiredCodeException') {
          setError('Verification code has expired. Please request a new one.');
        } else if (err.code === 'LimitExceededException') {
          setError('Too many attempts. Please try again later.');
        } else {
          setError(err.message || 'Failed to confirm registration. Please try again.');
        }
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Failed to confirm registration';
        setError(errorMessage);
      }

      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      clearError();

      await signOut();
      console.log('Signed out successfully');
      setUser(null);
    } catch (err: unknown) {
      console.error('Logout error:', err);
      setUser(null);

      const errorMessage = err instanceof Error ? err.message : 'Failed to sign out properly';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        confirmRegistration,
        logout,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => useContext(AuthContext);
