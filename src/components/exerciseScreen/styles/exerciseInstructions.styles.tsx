import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const exerciseInstructionsStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      borderRadius: 12,
      margin: 16,
      paddingTop: 20,
      paddingRight: 20,
      paddingLeft: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
      textAlign: 'center',
      fontFamily: theme.fonts.semiBold,
    },
    scrollContainer: {
      flex: 1,
      position: 'relative',
    },
    scrollContent: {
      paddingBottom: 20,
    },
    stepContainer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: 16,
      paddingHorizontal: 4,
    },
    stepNumber: {
      width: 28,
      height: 28,
      borderRadius: 14,
      backgroundColor: theme.colors.secondary,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
      marginTop: 2,
    },
    stepNumberText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: 'bold',
      fontFamily: theme.fonts.bold,
    },
    stepText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 24,
      color: theme.colors.text,
      fontFamily: theme.fonts.regular,
    },
  });
