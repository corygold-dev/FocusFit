import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { previewPhaseStyles } from './styles';

interface PreviewPhaseProps {
  exerciseName: string;
  onStart: () => void;
  onExit?: () => void;
}

export default function PreviewPhase({ exerciseName, onStart, onExit }: PreviewPhaseProps) {
  const { theme } = useTheme();
  const styles = previewPhaseStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ready to Move?</Text>
        <Text style={styles.subtitle}>Get ready for your next exercise</Text>
      </View>

      <View style={styles.exerciseSection}>
        <Text style={styles.exerciseLabel}>Next Exercise:</Text>
        <Text style={styles.exercise}>{exerciseName}</Text>
      </View>

      <View style={styles.mediaContainer}>
        <View style={styles.videoPlaceholder}>
          <Text style={styles.videoText}>Exercise Preview</Text>
          <Text style={styles.videoSubtext}>Watch the movement</Text>
        </View>
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
