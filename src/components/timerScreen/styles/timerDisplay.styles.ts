import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      paddingVertical: theme.spacing.sm,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      fontFamily: theme.fonts.title,
      textAlign: 'center',
    },
    progressContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    timerText: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      textAlign: 'center',
    },
    innerGlow: {
      position: 'absolute',
      width: 180,
      height: 180,
      borderRadius: 90,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 20,
      elevation: 10,
    },
    progressText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.medium,
      textAlign: 'center',
    },
  });
