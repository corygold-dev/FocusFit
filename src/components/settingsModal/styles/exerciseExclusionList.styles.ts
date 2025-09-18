import { StyleSheet } from 'react-native';
import { Theme } from '@/styles/theme';

export const createStyles = (theme: Theme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      marginBottom: 20,
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
    content: {
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      padding: 10,
      backgroundColor: theme.colors.surfaceVariant,
    },
    helpText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 15,
      textAlign: 'center',
    },
    categorySection: {
      marginBottom: 15,
    },
    categoryTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.textSecondary,
      marginBottom: 5,
      backgroundColor: isDark ? theme.colors.surfaceVariant : '#F0F4F8',
      paddingVertical: 5,
      paddingHorizontal: 10,
      borderRadius: 4,
    },
    exerciseRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 10,
      paddingHorizontal: 5,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.colors.border,
    },
    exerciseName: {
      fontSize: 16,
      flex: 1,
      color: theme.colors.text,
    },
  });
