// components/authScreen/styles/confirmationForm.styles.ts
import { Theme } from '@/styles/theme';
import { StyleSheet } from 'react-native';

export const confirmationFormStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: theme.colors.background,
    },
    headerContainer: {
      alignItems: 'center',
      marginBottom: 30,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 16,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.text + '99',
      textAlign: 'center',
      marginBottom: 8,
    },
    formContainer: {
      width: '100%',
      maxWidth: 400,
    },
    usernameText: {
      fontSize: 16,
      color: theme.colors.text,
      marginBottom: 20,
      fontWeight: '500',
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
    backLink: {
      marginTop: 20,
      alignItems: 'center',
    },
    linkText: {
      color: theme.colors.primary,
      fontSize: 16,
      textAlign: 'center',
    },
    errorText: {
      color: theme.colors.error,
      marginBottom: 15,
    },
  });
