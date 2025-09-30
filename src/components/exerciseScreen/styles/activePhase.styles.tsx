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
    titleSection: {
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
    mediaContainer: {
      alignItems: 'center',
      marginBottom: 32,
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
    timerSection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    timer: {
      fontSize: 56,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
      fontFamily: theme.fonts.bold,
    },
    progressContainer: {
      alignItems: 'center',
      width: '100%',
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 8,
      fontFamily: theme.fonts.medium,
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: 16,
    },
    actionButton: {
      flex: 1,
      height: 56,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    primaryButton: {
      backgroundColor: theme.colors.secondary,
    },
    secondaryButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    primaryButtonText: {
      color: theme.colors.background,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
    },
    secondaryButtonText: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
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
