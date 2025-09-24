import { useTheme } from '@/src/providers';
import { formatTime } from '@/src/utils/formatTime';
import React from 'react';
import { Text, View } from 'react-native';
import { countdownPhaseStyles } from './styles';

interface CountdownPhaseProps {
  secondsLeft: number;
}

export default function CountdownPhase({ secondsLeft }: CountdownPhaseProps) {
  const { theme } = useTheme();
  const styles = countdownPhaseStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Get ready...</Text>
      <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds until start`}>
        {formatTime(secondsLeft)}
      </Text>
    </View>
  );
}
