import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
      gap: 20,
    },
    errorText: {
      fontSize: 20,
      color: theme.colors.error,
      textAlign: 'center',
      marginBottom: 20,
    },
  });
