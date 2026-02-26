import { ErrorBoundary } from '@/src/components';
import { AppProviders } from '@/src/providers/AppProviders';
import { setupGlobalErrorHandling } from '@/src/utils/crashReporting';
import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';

setupGlobalErrorHandling();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <AppProviders>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(app)" />
            <Stack.Screen name="sign-in" />
            <Stack.Screen name="sign-up" />
            <Stack.Screen name="index" redirect />
          </Stack>
        </AppProviders>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
