// components/exercise/styles/countdownPhase.styles.ts
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
    timer: {
      fontSize: 48,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.text,
    },
  });
