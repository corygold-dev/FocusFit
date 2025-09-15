import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SoundProvider } from './providers/SoundProvider';

export default function RootLayout() {
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
