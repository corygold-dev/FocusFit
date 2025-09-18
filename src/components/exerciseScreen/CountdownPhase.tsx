import React from 'react';
import { Text } from 'react-native';
import { countdownPhaseStyles } from './styles';
import { formatTime } from '@/src/utils/formatTime';
import { useTheme } from '@/src/providers';

interface CountdownPhaseProps {
  secondsLeft: number;
}

export default function CountdownPhase({ secondsLeft }: CountdownPhaseProps) {
  const { theme } = useTheme();
  const styles = countdownPhaseStyles(theme);

  return (
    <>
      <Text style={styles.title}>Get ready...</Text>
      <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds until start`}>
        {formatTime(secondsLeft)}
      </Text>
    </>
  );
}
