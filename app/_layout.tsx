import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SoundProvider } from './providers/SoundProvider';
import { useNotificationsSetup } from './hooks/useNotificationsSetup';
import { UserSettingsProvider } from './providers/UserSettingsProvider';

export default function RootLayout() {
  useNotificationsSetup();

  return (
    <SafeAreaProvider>
      <UserSettingsProvider>
        <SoundProvider>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SoundProvider>
      </UserSettingsProvider>
    </SafeAreaProvider>
  );
}
