import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingVertical: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    welcomeContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    subtitleContainer: {
      alignItems: 'center',
      marginBottom: 40,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      color: theme.colors.text,
      textAlign: 'center',
      fontFamily: theme.fonts.bold,
    },
    welcomeText: {
      fontSize: 18,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      fontFamily: theme.fonts.medium,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      lineHeight: 24,
      fontFamily: theme.fonts.regular,
    },
    timeSelection: {
      alignItems: 'center',
      marginBottom: 40,
    },
    timeLabel: {
      fontSize: 20,
      color: theme.colors.text,
      marginBottom: 24,
      fontFamily: theme.fonts.semiBold,
    },
    presetGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      width: '100%',
    },
    presetButton: {
      width: '45%',
      height: 60,
    },
    selectedPreset: {
      backgroundColor: theme.colors.primary,
    },
    startButtonContainer: {
      marginTop: 40,
    },
    startButton: {
      height: 56,
      minWidth: 200,
    },
  });
