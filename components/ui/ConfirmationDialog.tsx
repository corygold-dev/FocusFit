import { useTheme } from '@/app/providers/ThemeProvider';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { createStyles } from './styles/confirmationDialog.styles';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmationDialog({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}: Props) {
  const { theme, isDark } = useTheme();
  const styles = createStyles(theme, isDark);

  if (!visible) return null;

  return (
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <Text style={styles.modalText}>{message}</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity
            style={[styles.modalButton, styles.cancelButton]}
            onPress={onCancel}
            accessibilityRole="button"
            accessibilityLabel={cancelText}
          >
            <Text style={styles.modalButtonText}>{cancelText}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.confirmButton]}
            onPress={onConfirm}
            accessibilityRole="button"
            accessibilityLabel={confirmText}
          >
            <Text style={[styles.modalButtonText, styles.confirmButtonText]}>{confirmText}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
