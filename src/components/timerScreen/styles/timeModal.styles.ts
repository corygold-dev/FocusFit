import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const timeModalStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    modalContent: {
      backgroundColor: theme.colors.modalBackground,
      borderRadius: 16,
      padding: 24,
      width: '100%',
      maxWidth: 400,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 12,
      fontFamily: theme.fonts.bold,
    },
    modalSubtitle: {
      fontSize: 24,
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 32,
      fontFamily: theme.fonts.bold,
    },
    modalButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
      gap: 12,
    },
    modalButton: {
      flex: 1,
    },
  });
