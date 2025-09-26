import { configureAmplify } from '@/config/amplify-config';
import { ErrorBoundary } from '@/src/components';
import {
  AuthProvider,
  BackendDataProvider,
  NotificationProvider,
  SoundProvider,
  SubscriptionProvider,
  ThemeProvider,
  TimerProvider,
  useAuth,
} from '@/src/providers';
import { setupGlobalErrorHandling } from '@/src/utils/crashReporting';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

setupGlobalErrorHandling();

try {
  configureAmplify();
} catch (error) {
  console.error('Failed to configure Amplify on startup:', error);
}

function SplashScreenController() {
  const { isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      SplashScreen.hideAsync();
    }
  }, [isLoading]);

  return null;
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ErrorBoundary>
          <BackendDataProvider>
            <ErrorBoundary>
              <SubscriptionProvider>
                <ErrorBoundary>
                  <SafeAreaProvider>
                    <ErrorBoundary>
                      <ThemeProvider>
                        <ErrorBoundary>
                          <NotificationProvider>
                            <ErrorBoundary>
                              <TimerProvider>
                                <ErrorBoundary>
                                  <SoundProvider>
                                    <SplashScreenController />
                                    <RootNavigator />
                                  </SoundProvider>
                                </ErrorBoundary>
                              </TimerProvider>
                            </ErrorBoundary>
                          </NotificationProvider>
                        </ErrorBoundary>
                      </ThemeProvider>
                    </ErrorBoundary>
                  </SafeAreaProvider>
                </ErrorBoundary>
              </SubscriptionProvider>
            </ErrorBoundary>
          </BackendDataProvider>
        </ErrorBoundary>
      </AuthProvider>
    </ErrorBoundary>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="confirm" />
      </Stack.Protected>

      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      <Stack.Screen name="index" redirect />
    </Stack>
  );
}
