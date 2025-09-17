import React from 'react';
import { Text, View } from 'react-native';
import Button from '@/components/ui/Button';
import { useTheme } from '@/app/providers/ThemeProvider';
import { createStyles } from './styles/previewPhase.styles';

interface PreviewPhaseProps {
  exerciseName: string;
  onStart: () => void;
}

export default function PreviewPhase({ exerciseName, onStart }: PreviewPhaseProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme);

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
