import { formatTime } from '@/utils/formatTime';
import React from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createStyles } from './styles/timerDisplay.styles';

interface TimerDisplayProps {
  title: string;
  progress: number;
  secondsLeft: number;
}

export default function TimerDisplay({ title, progress, secondsLeft }: TimerDisplayProps) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Progress.Circle
        progress={progress}
        size={200}
        showsText
        formatText={() => formatTime(secondsLeft)}
        thickness={12}
        color={theme.colors.primary}
        unfilledColor={isDark ? theme.colors.surfaceVariant : '#E1E8F0'}
        textStyle={{ color: theme.colors.text }}
      />
    </View>
  );
}
