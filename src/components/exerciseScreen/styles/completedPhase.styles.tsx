import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.text,
      textAlign: 'center',
    },
    completedText: {
      fontSize: 24,
      color: theme.colors.secondary,
      marginBottom: 30,
      textAlign: 'center',
    },
    returnButton: {
      marginTop: 20,
    },
  });
