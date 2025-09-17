import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.text,
    },
    exercise: {
      fontSize: 32,
      fontWeight: '600',
      marginBottom: 40,
      textAlign: 'center',
      color: theme.colors.text,
    },
    videoPlaceholder: {
      width: 300,
      height: 180,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    videoText: {
      color: theme.colors.textSecondary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
