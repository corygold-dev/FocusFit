import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const workoutChoiceModalStyles = (theme: Theme) =>
  StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      maxWidth: 400,
      backgroundColor: theme.colors.modalBackground,
      borderRadius: 16,
      padding: 24,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.secondary,
      shadowColor: theme.colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 8,
    },
    container: {
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text + '80',
      marginBottom: 32,
      textAlign: 'center',
    },
    optionsContainer: {
      width: '100%',
      gap: 16,
      marginBottom: 24,
    },
    strengthButton: {
      backgroundColor: theme.colors.secondary,
      borderColor: theme.colors.secondary,
    },
    mobilityButton: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.secondary,
    },
    skipButton: {
      backgroundColor: 'transparent',
      borderColor: theme.colors.text + '40',
      marginTop: 8,
    },
    description: {
      fontSize: 14,
      color: theme.colors.text + '60',
      textAlign: 'center',
      lineHeight: 20,
    },
  });
