import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    equipmentButton: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: theme.colors.primary,
      borderRadius: 8,
      margin: 5,
    },
    optionSelected: {
      backgroundColor: theme.colors.primary,
    },
    optionText: {
      fontWeight: '600',
      color: theme.colors.primary,
    },
    optionTextSelected: {
      color: '#ffffff',
    },
  });
