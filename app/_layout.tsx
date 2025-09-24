import { configureAmplify } from '@/config/amplify-config';
import { ErrorBoundary } from '@/src/components';
import {
  AuthProvider,
  SoundProvider,
  SubscriptionProvider,
  ThemeProvider,
  TimerProvider,
  UserSettingsProvider,
  useAuth,
} from '@/src/providers';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNotificationsSetup } from '../src/hooks';

configureAmplify();

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
  useNotificationsSetup();

  return (
    <ErrorBoundary>
      <AuthProvider>
        <SubscriptionProvider>
          <SafeAreaProvider>
            <ThemeProvider>
              <UserSettingsProvider>
                <TimerProvider>
                  <SoundProvider>
                    <SplashScreenController />
                    <RootNavigator />
                  </SoundProvider>
                </TimerProvider>
              </UserSettingsProvider>
            </ThemeProvider>
          </SafeAreaProvider>
        </SubscriptionProvider>
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
