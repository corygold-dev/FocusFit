import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { completedPhaseStyles } from './styles';
import { ENCOURAGEMENT_PHRASES } from '@/src/utils/constants';

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
  const [finishingMessageIndex, setFinishingMessageIndex] = useState(0);

  setFinishingMessageIndex(
    Math.floor(Math.random() * ENCOURAGEMENT_PHRASES.length)
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Workout Complete!</Text>
      <Text style={styles.completedText}>
        {ENCOURAGEMENT_PHRASES[finishingMessageIndex]}
      </Text>
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
