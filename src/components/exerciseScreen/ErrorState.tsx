import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import React from 'react';
import { Text, View } from 'react-native';
import { errorStateStyles } from './styles';

interface ErrorStateProps {
  error: string;
  onReturnHome: () => void;
}

export default function ErrorState({ error, onReturnHome }: ErrorStateProps) {
  const { theme } = useTheme();
  const styles = errorStateStyles(theme);

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
