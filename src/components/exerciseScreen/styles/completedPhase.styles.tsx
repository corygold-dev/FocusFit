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
    completedText: {
      fontSize: 24,
      color: theme.colors.success,
      marginBottom: 30,
    },
    returnButton: {
      marginTop: 20,
    },
  });
