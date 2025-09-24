import { useTheme } from '@/src/providers';
import { TIMER } from '@/src/utils/constants';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { timerPresetsStyles } from './styles';

interface TimerPresetsProps {
  isRunning: boolean;
  onSelectPreset: (minutes: number) => void;
  selectedMinutes?: number;
}

export default function TimerPresets({
  isRunning,
  onSelectPreset,
  selectedMinutes,
}: TimerPresetsProps) {
  const { theme } = useTheme();
  const styles = timerPresetsStyles(theme);

  return (
    <View style={styles.presets}>
      {TIMER.PRESET_MINUTES.map((preset) => {
        const isSelected = selectedMinutes === preset.value;
        return (
          <TouchableOpacity
            key={preset.value}
            style={[
              styles.presetButton,
              isSelected ? styles.selectedButton : styles.unselectedButton,
            ]}
            disabled={isRunning}
            accessibilityLabel={`Set timer to ${preset.value} minutes`}
            onPress={() => {
              if (!isRunning) {
                onSelectPreset(preset.value);
              }
            }}
          >
            <Text
              style={[styles.presetText, isSelected ? styles.selectedText : styles.unselectedText]}
            >
              {preset.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
