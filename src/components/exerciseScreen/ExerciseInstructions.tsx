import { useTheme } from '@/src/providers';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { exerciseInstructionsStyles } from './styles/exerciseInstructions.styles';

interface ExerciseInstructionsProps {
  exerciseName: string;
  steps: string[];
}

export default function ExerciseInstructions({
  exerciseName,
  steps,
}: ExerciseInstructionsProps) {
  const { theme } = useTheme();
  const styles = exerciseInstructionsStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How to do {exerciseName}</Text>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {steps.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
