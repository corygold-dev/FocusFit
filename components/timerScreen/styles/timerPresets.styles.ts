import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    presets: {
      flexDirection: 'row',
      justifyContent: 'center',
      flexWrap: 'wrap',
      gap: 12,
      marginVertical: theme.spacing.md,
    },
    presetButton: {
      minWidth: 80,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
  });
