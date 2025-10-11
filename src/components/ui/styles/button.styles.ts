import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (
  theme: Theme,
  variant: 'primary' | 'secondary',
  disabled: boolean
) =>
  StyleSheet.create({
    button: {
      paddingVertical: 12,
      paddingHorizontal: 24,
      borderRadius: 8,
      minWidth: 100,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primary: {
      backgroundColor: theme.colors.primary,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    disabled: {
      backgroundColor:
        disabled && variant === 'primary'
          ? theme.colors.buttonDisabled
          : 'transparent',
      borderColor: theme.colors.textSecondary,
      opacity: 0.7,
    },
    text: {
      fontSize: 16,
      fontWeight: '600',
    },
    primaryText: {
      color: '#FFFFFF',
    },
    secondaryText: {
      color: theme.colors.primary,
    },
    disabledText: {
      color: theme.colors.textSecondary,
    },
  });
