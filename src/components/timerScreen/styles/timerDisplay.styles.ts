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
      fontSize: 36,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      fontFamily: theme.fonts.title,
      textAlign: 'center',
      letterSpacing: 1,
    },
    progressContainer: {
      position: 'relative',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
      marginBottom: theme.spacing.sm,
    },
    timerText: {
      fontSize: 48,
      fontWeight: 'bold',
      color: theme.colors.text,
      fontFamily: theme.fonts.bold,
      textAlign: 'center',
      letterSpacing: 1,
    },
    innerGlow: {
      position: 'absolute',
      width: 280,
      height: 280,
      borderRadius: 140,
      backgroundColor: theme.colors.primary,
      shadowColor: theme.colors.primary,
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 40,
      elevation: 20,
    },
    progressText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      fontFamily: theme.fonts.medium,
      textAlign: 'center',
    },
  });
