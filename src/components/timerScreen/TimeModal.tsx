import { useTheme } from '@/src/providers/ThemeProvider';
import { formatTime } from '@/src/utils/formatTime';
import React from 'react';
import { Modal, Text, View } from 'react-native';
import Button from '../ui/Button';
import TimerSlider from './TimerSlider';
import { timeModalStyles } from './styles/timeModal.styles';

interface TimeModalProps {
  visible: boolean;
  onClose: () => void;
  secondsLeft: number;
  isRunning: boolean;
  onChange: (minutes: number) => void;
}

export default function TimeModal({
  visible,
  onClose,
  secondsLeft,
  isRunning,
  onChange,
}: TimeModalProps) {
  const { theme } = useTheme();
  const styles = timeModalStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Focus Time</Text>
          <Text style={styles.modalSubtitle}>{formatTime(secondsLeft)}</Text>
          <TimerSlider
            value={secondsLeft}
            isRunning={isRunning}
            onChange={onChange}
          />
          <View style={styles.modalButtons}>
            <Button
              title="Cancel"
              variant="secondary"
              onPress={onClose}
              style={styles.modalButton}
            />
            <Button
              title="Set Time"
              variant="primary"
              onPress={onClose}
              style={styles.modalButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
