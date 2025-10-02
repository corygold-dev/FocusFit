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
    focusPhraseContainer: {
      paddingVertical: 8,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    focusPhraseText: {
      fontSize: 24,
      textAlign: 'center',
    },
  });
