import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    dropdownContainer: {
      position: 'relative',
      zIndex: 10,
    },
    dropdownButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 15,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      backgroundColor: theme.colors.surfaceVariant,
    },
    dropdownText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    dropdownMenu: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      backgroundColor: theme.colors.modalBackground,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginTop: 5,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
      zIndex: 20,
    },
    dropdownOption: {
      paddingVertical: 10,
      paddingHorizontal: 15,
    },
    dropdownOptionSelected: {
      backgroundColor: theme.colors.surfaceVariant,
    },
    dropdownOptionText: {
      fontSize: 16,
      color: theme.colors.text,
    },
    dropdownOptionTextSelected: {
      color: theme.colors.primary,
      fontWeight: 'bold',
    },
  });
