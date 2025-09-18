import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import React from 'react';
import { Text, View } from 'react-native';
import { previewPhaseStyles } from './styles';

interface PreviewPhaseProps {
  exerciseName: string;
  onStart: () => void;
}

export default function PreviewPhase({ exerciseName, onStart }: PreviewPhaseProps) {
  const { theme } = useTheme();
  const styles = previewPhaseStyles(theme);

  return (
    <>
      <Text style={styles.title}>Next up:</Text>
      <View style={styles.videoPlaceholder}>
        <Text style={styles.videoText}>Video Preview</Text>
      </View>
      <Text style={styles.exercise}>{exerciseName}</Text>
      <Button
        title="Start exercise"
        variant="primary"
        onPress={onStart}
        accessibilityLabel={`Start ${exerciseName} exercise`}
      />
    </>
  );
}
