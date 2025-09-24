import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      gap: 30,
      backgroundColor: theme.colors.background,
    },
    timeButtonContainer: {
      marginVertical: 20,
    },
    timeButton: {
      minWidth: 200,
    },
  });
