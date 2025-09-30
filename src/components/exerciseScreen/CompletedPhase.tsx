import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import React from 'react';
import { Text, View } from 'react-native';
import { completedPhaseStyles } from './styles';

interface CompletedPhaseProps {
  onReturnHome: () => void;
  onSetFocusTime?: (time: number) => void;
  previousFocusTime?: number;
}

export default function CompletedPhase({
  onReturnHome,
  onSetFocusTime,
  previousFocusTime,
}: CompletedPhaseProps) {
  const { theme } = useTheme();
  const styles = completedPhaseStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Complete!</Text>
      <Text style={styles.completedText}>Great job — don't forget to hydrate!</Text>
      <Button
        title="Time to Focus"
        variant="primary"
        onPress={() => {
          if (onSetFocusTime && previousFocusTime) {
            onSetFocusTime(previousFocusTime);
          }
          onReturnHome();
        }}
        accessibilityLabel="Return to timer screen"
        style={styles.returnButton}
      />
    </View>
  );
}
