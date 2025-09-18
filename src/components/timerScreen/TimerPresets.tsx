import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import { TIMER } from '@/src/utils/constants';
import React from 'react';
import { View } from 'react-native';
import { timerPresetsStyles } from './styles';

interface TimerPresetsProps {
  isRunning: boolean;
  onSelectPreset: (minutes: number) => void;
}

export default function TimerPresets({ isRunning, onSelectPreset }: TimerPresetsProps) {
  const { theme } = useTheme();
  const styles = timerPresetsStyles(theme);

  return (
    <View style={styles.presets}>
      {TIMER.PRESET_MINUTES.map((min) => (
        <Button
          key={min}
          title={`${min} min`}
          variant="secondary"
          disabled={isRunning}
          accessibilityLabel={`Set timer to ${min} minutes`}
          onPress={() => {
            if (!isRunning) {
              onSelectPreset(min);
            }
          }}
          style={styles.presetButton}
        />
      ))}
    </View>
  );
}
