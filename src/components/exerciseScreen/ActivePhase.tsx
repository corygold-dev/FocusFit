import { useTheme } from '@/src/providers';
import { formatTime } from '@/src/utils/formatTime';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import { activePhaseStyles } from './styles';

interface ActivePhaseProps {
  exerciseName: string;
  secondsLeft: number;
  progress: number;
  onSkip?: () => void;
  onRestart?: () => void;
}

export default function ActivePhase({
  exerciseName,
  secondsLeft,
  progress,
  onSkip,
  onRestart,
}: ActivePhaseProps) {
  const { theme } = useTheme();
  const styles = activePhaseStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{exerciseName}</Text>
        <Text style={styles.subtitle}>Keep going! You're doing great.</Text>
      </View>

      <View style={styles.mediaContainer}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoText}>Exercise Demo</Text>
          <Text style={styles.videoSubtext}>Follow the movement</Text>
        </View>
      </View>

      <View style={styles.timerSection}>
        <Text style={styles.timer} accessibilityLabel={`${secondsLeft} seconds remaining`}>
          {formatTime(secondsLeft)}
        </Text>

        <View style={styles.progressContainer}>
          <Progress.Bar
            progress={progress}
            width={280}
            height={8}
            color={theme.colors.secondary}
            unfilledColor={theme.colors.surfaceVariant}
            borderColor="transparent"
            borderRadius={4}
            accessibilityLabel={`Progress: ${Math.round(progress * 100)}%`}
          />
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={onRestart}>
          <Text style={styles.secondaryButtonText}>Restart</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.primaryButton]} onPress={onSkip}>
          <Text style={styles.primaryButtonText}>Skip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
