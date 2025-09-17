import React from 'react';
import { Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createStyles } from './styles/errorState.styles';

interface ErrorStateProps {
  error: string;
  onReturnHome: () => void;
}

export default function ErrorState({ error, onReturnHome }: ErrorStateProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.errorText}>{error}</Text>
      <Button
        title="Return Home"
        variant="primary"
        onPress={onReturnHome}
        accessibilityLabel="Return to home screen"
      />
    </View>
  );
}
