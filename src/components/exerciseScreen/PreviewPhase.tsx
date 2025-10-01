import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import { exercises } from '@/src/lib/exercises';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import ExerciseInstructions from './ExerciseInstructions';
import { previewPhaseStyles } from './styles';

interface PreviewPhaseProps {
  exerciseName: string;
  onStart: () => void;
  onExit?: () => void;
}

export default function PreviewPhase({ exerciseName, onStart, onExit }: PreviewPhaseProps) {
  const { theme } = useTheme();
  const styles = previewPhaseStyles(theme);

  const exercise = exercises.find((ex) => ex.name === exerciseName);
  const instructions = exercise?.instructions || [
    'Prepare for the exercise',
    'Focus on proper form',
    'Maintain controlled movement',
    'Breathe steadily throughout',
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ready to Move?</Text>
        <Text style={styles.subtitle}>Get ready for your next exercise</Text>
      </View>

      <View style={styles.exerciseSection}>
        <Text style={styles.exercise}>{exerciseName}</Text>
      </View>

      <View style={styles.mediaContainer}>
        <ExerciseInstructions exerciseName={exerciseName} steps={instructions} />
      </View>

      <View style={styles.actionSection}>
        <Button
          title="Start Exercise"
          variant="primary"
          onPress={onStart}
          accessibilityLabel={`Start ${exerciseName} exercise`}
          style={[styles.startButton, { backgroundColor: theme.colors.secondary }]}
        />
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
