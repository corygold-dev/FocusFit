import { useTheme } from '@/src/providers';
import React from 'react';
import { View } from 'react-native';
import { Button } from '../ui';
import { timerControlsStyles } from './styles';

interface TimerControlsProps {
  isRunning: boolean;
  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export default function TimerControls({
  isRunning,
  onToggle,
  onReset,
  onSkip,
}: TimerControlsProps) {
  const { theme } = useTheme();
  const styles = timerControlsStyles(theme);

  return (
    <View style={styles.buttonContainer}>
      <Button
        title={isRunning ? 'Pause' : 'Start'}
        onPress={onToggle}
        accessibilityLabel={isRunning ? 'Pause timer' : 'Start timer'}
      />
      <Button
        title="Reset"
        onPress={onReset}
        disabled={isRunning}
        accessibilityLabel="Reset timer"
      />
      <Button
        title="Skip"
        onPress={onSkip}
        accessibilityLabel="Skip timer and go to exercises"
      />
    </View>
  );
}
