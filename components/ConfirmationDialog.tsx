import { useTheme } from '@/app/providers/ThemeProvider';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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

  if (!visible) return null;

  const styles = StyleSheet.create({
    modalOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    },
    modalContent: {
      backgroundColor: theme.colors.modalBackground,
      borderRadius: 10,
      padding: 20,
      width: '80%',
      maxWidth: 400,
      alignItems: 'center',
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
      color: theme.colors.text,
    },
    modalText: {
      fontSize: 16,
      marginBottom: 20,
      textAlign: 'center',
      color: theme.colors.textSecondary,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      width: '100%',
    },
    modalButton: {
      padding: 10,
      borderRadius: 5,
      minWidth: 100,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: isDark ? theme.colors.surfaceVariant : '#f0f0f0',
    },
    confirmButton: {
      backgroundColor: theme.colors.primary,
    },
    modalButtonText: {
      fontSize: 16,
      fontWeight: '600',
      color: isDark ? theme.colors.text : theme.colors.textSecondary,
    },
    confirmButtonText: {
      color: 'white',
    },
  });

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
