import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      alignItems: 'center',
      marginVertical: theme.spacing.md,
    },
    slider: {
      width: 250,
      height: 40,
    },
  });
