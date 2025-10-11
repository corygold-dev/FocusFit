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

export default function TimerDisplay({
  title,
  progress,
  secondsLeft,
}: TimerDisplayProps) {
  const { theme } = useTheme();
  const styles = timerDisplayStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.progressContainer}>
        <Progress.Circle
          progress={progress}
          size={320}
          showsText
          formatText={() => formatTime(secondsLeft)}
          thickness={30}
          color={theme.colors.primary}
          unfilledColor={theme.colors.surfaceVariant}
          textStyle={styles.timerText}
          borderWidth={0}
          strokeCap="round"
        />

        <View style={[styles.innerGlow, { opacity: progress * 0.4 }]} />
      </View>
    </View>
  );
}
