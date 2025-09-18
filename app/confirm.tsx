import { ConfirmationForm } from '@/src/components/authScreen';
import { useTheme } from '@/src/providers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function Confirm() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { theme } = useTheme();
  const username = params.username as string;

  const navigateToSignIn = () => {
    router.push('/sign-in');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ConfirmationForm username={username} onNavigateToLogin={navigateToSignIn} />
    </View>
  );
}
