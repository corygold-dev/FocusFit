import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SoundProvider } from './providers/SoundProvider';
import { useNotificationsSetup } from './hooks/useNotificationsSetup';

export default function RootLayout() {
  useNotificationsSetup();

  return (
    <SafeAreaProvider>
      <SoundProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </SoundProvider>
    </SafeAreaProvider>
  );
}
