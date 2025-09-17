import React from 'react';
import { Text } from 'react-native';
import * as Progress from 'react-native-progress';
import { formatTime } from '@/utils/formatTime';
import { activePhaseStyles } from './styles';
import { useTheme } from '@/app/providers';

interface ActivePhaseProps {
  exerciseName: string;
  secondsLeft: number;
  progress: number;
}

export default function ActivePhase({ exerciseName, secondsLeft, progress }: ActivePhaseProps) {
  const { theme, isDark } = useTheme();
  const styles = activePhaseStyles(theme);

  return (
    <>
      <Text style={styles.title}>{exerciseName}</Text>
      <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds remaining`}>
        {formatTime(secondsLeft)}
      </Text>
      <Progress.Bar
        progress={progress}
        width={200}
        height={12}
        color={theme.colors.primary}
        unfilledColor={isDark ? theme.colors.surfaceVariant : '#eee'}
        borderColor={theme.colors.border}
        accessibilityLabel={`Progress: ${Math.round(progress * 100)}%`}
      />
    </>
  );
}
