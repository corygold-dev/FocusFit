import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { loadingStateStyles } from './styles';
import { useTheme } from '@/app/providers';

export default function LoadingState() {
  const { theme } = useTheme();
  const styles = loadingStateStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading your workout...</Text>
    </View>
  );
}
