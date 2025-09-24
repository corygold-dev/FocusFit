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
    timer: {
      fontSize: 48,
      fontWeight: 'bold',
      marginBottom: 20,
      color: theme.colors.text,
      textAlign: 'center',
    },
  });
