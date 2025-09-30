import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      alignItems: 'center',
      marginBottom: 32,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      marginBottom: 8,
      fontFamily: theme.fonts.title,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontFamily: theme.fonts.regular,
    },
    exerciseSection: {
      alignItems: 'center',
      marginBottom: 32,
    },
    exerciseLabel: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontFamily: theme.fonts.medium,
    },
    exercise: {
      fontSize: 32,
      fontWeight: '600',
      textAlign: 'center',
      color: theme.colors.text,
      fontFamily: theme.fonts.semiBold,
    },
    mediaContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    videoPlaceholder: {
      width: 320,
      height: 200,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    videoText: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
      marginBottom: 4,
    },
    videoSubtext: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      fontFamily: theme.fonts.regular,
    },
    actionSection: {
      alignItems: 'center',
    },
    startButton: {
      height: 56,
      minWidth: 200,
    },
    exitButtonContainer: {
      marginTop: 24,
      alignItems: 'center',
    },
    exitButton: {
      paddingHorizontal: 24,
      paddingVertical: 12,
      borderRadius: 8,
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.error,
    },
    exitButtonText: {
      color: theme.colors.error,
      fontSize: 14,
      fontWeight: '500',
      fontFamily: theme.fonts.medium,
    },
  });
