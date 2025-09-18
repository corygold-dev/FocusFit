import Button from '@/src/components/ui/Button';
import React from 'react';
import { Text } from 'react-native';
import { completedPhaseStyles } from './styles';
import { useTheme } from '@/src/providers';

interface CompletedPhaseProps {
  onReturnHome: () => void;
}

export default function CompletedPhase({ onReturnHome }: CompletedPhaseProps) {
  const { theme } = useTheme();
  const styles = completedPhaseStyles(theme);

  return (
    <>
      <Text style={styles.title}>Workout Complete!</Text>
      <Text style={styles.completedText}>Great job — don't forget to hydrate!</Text>
      <Button
        title="Return Home"
        variant="primary"
        onPress={onReturnHome}
        accessibilityLabel="Return to home screen"
        style={styles.returnButton}
      />
    </>
  );
}
