import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const registerFormStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    logoContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 8,
    },
    formContainer: {
      width: '100%',
      maxWidth: 400,
    },
    input: {
      width: '100%',
      height: 50,
      borderWidth: 1,
      borderColor: theme.colors.border,
      borderRadius: 8,
      marginBottom: 15,
      paddingHorizontal: 10,
      color: theme.colors.text,
      backgroundColor: theme.colors.card,
    },
    inputError: {
      borderColor: theme.colors.error,
      borderWidth: 2,
      marginBottom: 8,
    },
    button: {
      width: '100%',
      height: 50,
      backgroundColor: theme.colors.primary,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    linkText: {
      color: theme.colors.primary,
      marginTop: 20,
      textAlign: 'center',
    },
    errorContainer: {
      backgroundColor: theme.colors.error + '15',
      borderRadius: 8,
      padding: 10,
      marginBottom: 15,
      borderLeftWidth: 3,
      borderLeftColor: theme.colors.error,
    },
    errorText: {
      color: theme.colors.error,
      fontSize: 14,
    },
    socialButton: {
      marginBottom: 10,
    },
    dividerContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 20,
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.colors.border,
    },
    dividerText: {
      marginHorizontal: 15,
      color: theme.colors.text + '80',
      fontSize: 14,
    },
  });
