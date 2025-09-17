import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    buttonContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 20,
      justifyContent: 'center',
      marginTop: theme.spacing.lg,
    },
  });
