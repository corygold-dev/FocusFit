import { ErrorBoundary } from '@/src/components';
import { useAuth } from '@/src/providers';
import { AppProviders } from '@/src/providers/AppProviders';
import { setupGlobalErrorHandling } from '@/src/utils/crashReporting';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

setupGlobalErrorHandling();

function SplashScreenController() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return null;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProviders>
          <SplashScreenController />
          <RootNavigator />
        </AppProviders>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
      <Stack.Protected guard={isAuthenticated}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
      <Stack.Screen name="index" redirect />
    </Stack>
  );
}
