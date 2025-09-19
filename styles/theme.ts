export const colors = {
  primary: '#FF6B35',
  primaryLight: '#FF9248',
  secondary: '#3A86FF',

  success: '#2DD881',
  error: '#FF4E4E',

  light: {
    background: '#FFFDF7',
    surface: '#FFF5EC',
    surfaceVariant: '#EAF4FF',
    text: '#1C1C1E',
    textSecondary: '#555B66',
    border: '#E0E6ED',
    switchThumb: '#FFFFFF',
    buttonDisabled: '#D1D5DB',
    modalBackground: '#FFFFFF',
    card: '#FFFFFF',
  },

  dark: {
    background: '#0F1115',
    surface: '#1A1C22',
    surfaceVariant: '#2B3140',
    text: '#F8F9FA',
    textSecondary: '#A0AEC0',
    border: '#39414F',
    switchThumb: '#E5E7EB',
    buttonDisabled: '#6B7280',
    modalBackground: '#1F1F1F',
    card: '#1E1E1E',
  },
};

const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
};

// Font sizes used throughout the app
const fontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const getTheme = (isDark: boolean) => ({
  colors: {
    ...colors,
    ...(isDark ? colors.dark : colors.light),
  },
  fonts: fontFamily,
  fontSizes: fontSizes,
  spacing,
});

export type Theme = ReturnType<typeof getTheme>;
