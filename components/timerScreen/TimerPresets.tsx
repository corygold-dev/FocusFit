import { TIMER } from '@/utils/constants';
import React from 'react';
import { View } from 'react-native';
import Button from '@/components/ui/Button';
import { timerPresetsStyles } from './styles';
import { useTheme } from '@/app/providers';

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
