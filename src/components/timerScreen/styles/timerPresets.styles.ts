import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    presets: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 16,
      marginVertical: theme.spacing.sm,
      paddingHorizontal: 24,
    },
    presetButton: {
      width: '45%',
      height: 60,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    selectedButton: {
      backgroundColor: theme.colors.primary,
      borderWidth: 2,
      borderColor: theme.colors.primary,
    },
    unselectedButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    presetText: {
      fontSize: 16,
      fontWeight: '600',
      fontFamily: theme.fonts.semiBold,
    },
    selectedText: {
      color: theme.colors.background,
    },
    unselectedText: {
      color: theme.colors.text,
    },
  });
