import { RegisterForm } from '@/src/components/authScreen';
import { useTheme } from '@/src/providers';
import { useRouter } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function SignUp() {
  const router = useRouter();
  const { theme } = useTheme();

  const navigateToSignIn = () => {
    router.push('/sign-in');
  };

  const navigateToConfirm = (username: string) => {
    router.push({
      pathname: '/confirm',
      params: { username },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <RegisterForm
        onNavigateToLogin={navigateToSignIn}
        onNavigateToConfirmation={navigateToConfirm}
      />
    </View>
  );
}
