import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createStyles } from './styles/loadingState.styles';

export default function LoadingState() {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
      <Text style={styles.loadingText}>Loading your workout...</Text>
    </View>
  );
}
