import { LoginForm } from '@/src/components/authScreen';
import { useTheme } from '@/src/providers';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function SignIn() {
  const router = useRouter();
  const { theme } = useTheme();

  const navigateToSignUp = () => {
    router.replace('/sign-up');
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <LoginForm onNavigateToRegister={navigateToSignUp} />
    </View>
  );
}
