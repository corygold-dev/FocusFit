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
    errorText: {
      color: theme.colors.error,
      marginBottom: 15,
    },
  });
