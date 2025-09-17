import { Stack } from 'expo-router';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNotificationsSetup } from './hooks/useNotificationsSetup';
import { SoundProvider } from './providers/SoundProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { UserSettingsProvider } from './providers/UserSettingsProvider';

export default function RootLayout() {
  useNotificationsSetup();

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <UserSettingsProvider>
          <SoundProvider>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </SoundProvider>
        </UserSettingsProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
