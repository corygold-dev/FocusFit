import { SLIDER } from '@/utils/constants';
import React from 'react';
import { View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createStyles } from './styles/timerSlider.styles';

interface TimerSliderProps {
  value: number;
  isRunning: boolean;
  onChange: (minutes: number) => void;
}

export default function TimerSlider({ value, isRunning, onChange }: TimerSliderProps) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

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
        maximumTrackTintColor={isDark ? theme.colors.surfaceVariant : '#E1E8F0'}
        thumbTintColor={theme.colors.primaryLight}
        disabled={isRunning}
        accessibilityLabel={`Adjust timer duration, currently ${Math.floor(value / 60)} minutes`}
      />
    </View>
  );
}
