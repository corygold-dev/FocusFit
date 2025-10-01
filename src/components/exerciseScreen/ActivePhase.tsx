import { exercises } from '@/src/lib/exercises';
import { useTheme } from '@/src/providers';
import { formatTime } from '@/src/utils/formatTime';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import * as Progress from 'react-native-progress';
import ExerciseInstructions from './ExerciseInstructions';
import { activePhaseStyles } from './styles';

interface ActivePhaseProps {
  exerciseName: string;
  secondsLeft: number;
  progress: number;
  onSkip?: () => void;
  onRestart?: () => void;
  onExit?: () => void;
}

export default function ActivePhase({
  exerciseName,
  secondsLeft,
  progress,
  onSkip,
  onRestart,
  onExit,
}: ActivePhaseProps) {
  const { theme } = useTheme();
  const styles = activePhaseStyles(theme);

  const exercise = exercises.find((ex) => ex.name === exerciseName);
  const instructions = exercise?.instructions || [
    'Prepare for the exercise',
    'Focus on proper form',
    'Maintain controlled movement',
    'Breathe steadily throughout',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{exerciseName}</Text>
        <Text style={styles.subtitle}>Keep going! You're doing great.</Text>
      </View>

      <View style={styles.mediaContainer}>
        <ExerciseInstructions exerciseName={exerciseName} steps={instructions} />
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

      {onExit && (
        <View style={styles.exitButtonContainer}>
          <TouchableOpacity style={styles.exitButton} onPress={onExit}>
            <Text style={styles.exitButtonText}>Exit Workout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
