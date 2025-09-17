import React from 'react';
import { Text } from 'react-native';
import { formatTime } from '@/utils/formatTime';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createStyles } from './styles/countdownPhase.styles';

interface CountdownPhaseProps {
  secondsLeft: number;
}

export default function CountdownPhase({ secondsLeft }: CountdownPhaseProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <>
      <Text style={styles.title}>Get ready...</Text>
      <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds until start`}>
        {formatTime(secondsLeft)}
      </Text>
    </>
  );
}
