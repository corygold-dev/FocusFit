import { configureAmplify } from '@/config/amplify-config';
import { SplashScreen, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNotificationsSetup } from '../src/hooks';
import {
  AuthProvider,
  SoundProvider,
  SubscriptionProvider,
  ThemeProvider,
  UserSettingsProvider,
  useAuth,
} from '@/src/providers';

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
    <AuthProvider>
      <SubscriptionProvider>
        <SafeAreaProvider>
          <ThemeProvider>
            <UserSettingsProvider>
              <SoundProvider>
                <SplashScreenController />
                <RootNavigator />
              </SoundProvider>
            </UserSettingsProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // or a loading indicator
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Public screens - accessible when not authenticated */}
      <Stack.Protected guard={!isAuthenticated}>
        <Stack.Screen name="sign-in" />
        <Stack.Screen name="sign-up" />
        <Stack.Screen name="confirm" />
      </Stack.Protected>

      {/* Protected screens - accessible when authenticated */}
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>

      {/* Default redirect */}
      <Stack.Screen name="index" redirect />
    </Stack>
  );
}
