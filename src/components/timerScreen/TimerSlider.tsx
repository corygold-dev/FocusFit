import { useTheme } from '@/src/providers';
import { SLIDER } from '@/src/utils/constants';
import Slider from '@react-native-community/slider';
import React from 'react';
import { View } from 'react-native';
import { timerSliderStyles } from './styles';

interface TimerSliderProps {
  value: number;
  isRunning: boolean;
  onChange: (minutes: number) => void;
}

export default function TimerSlider({ value, isRunning, onChange }: TimerSliderProps) {
  const { theme } = useTheme();
  const styles = timerSliderStyles(theme);

  return (
    <View style={styles.container}>
      <Slider
        style={styles.slider}
        minimumValue={SLIDER.MIN}
        maximumValue={SLIDER.MAX}
        step={SLIDER.STEP}
        value={value / 60}
        onValueChange={(minutes) => {
          if (!isRunning) {
            onChange(minutes);
          }
        }}
        minimumTrackTintColor={isRunning ? theme.colors.textSecondary : theme.colors.primary}
        maximumTrackTintColor={theme.colors.surfaceVariant}
        thumbTintColor={theme.colors.primaryLight}
        disabled={isRunning}
        accessibilityLabel={`Adjust timer duration, currently ${Math.floor(value / 60)} minutes`}
      />
    </View>
  );
}
