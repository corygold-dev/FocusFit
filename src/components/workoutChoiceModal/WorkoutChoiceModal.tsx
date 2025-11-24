import Button from '@/src/components/ui/Button';
import { useTheme } from '@/src/providers';
import React from 'react';
import { Modal, Text, View } from 'react-native';
import { workoutChoiceModalStyles } from './styles/workoutChoiceModal.styles';

interface WorkoutChoiceModalProps {
  visible: boolean;
  onChooseStrength: () => void;
  onChooseMobility: () => void;
  onSkip?: () => void;
}

export default function WorkoutChoiceModal({
  visible,
  onChooseStrength,
  onChooseMobility,
  onSkip,
}: WorkoutChoiceModalProps) {
  const { theme } = useTheme();
  const styles = workoutChoiceModalStyles(theme);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.container}>
            <Text style={styles.title}>Time to Move!</Text>
            <Text style={styles.subtitle}>Choose your workout type</Text>
            <View style={styles.optionsContainer}>
              <Button
                title="I want to get stronger"
                variant="primary"
                onPress={onChooseStrength}
                style={styles.strengthButton}
                accessibilityLabel="Choose strength workout"
              />

              <Button
                title="I need to move better"
                variant="secondary"
                onPress={onChooseMobility}
                style={styles.mobilityButton}
                accessibilityLabel="Choose mobility workout"
              />

              {onSkip && (
                <Button
                  title="Skip for now"
                  variant="secondary"
                  onPress={onSkip}
                  style={styles.skipButton}
                  accessibilityLabel="Skip workout"
                />
              )}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}
