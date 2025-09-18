import { useTheme } from '@/src/providers';
import { formatTime } from '@/src/utils/formatTime';
import React from 'react';
import { Text, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { timerDisplayStyles } from './styles';

interface TimerDisplayProps {
  title: string;
  progress: number;
  secondsLeft: number;
}

export default function TimerDisplay({ title, progress, secondsLeft }: TimerDisplayProps) {
  const { theme, isDark } = useTheme();
  const styles = timerDisplayStyles(theme);

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
