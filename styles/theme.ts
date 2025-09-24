export const colors = {
  // Focus colors - deep navy for calm, trust, focus
  primary: '#3B82F6', // Electric blue for focus
  primaryLight: '#60A5FA',
  primaryDark: '#1E40AF',

  // Energy colors - orange for movement, warmth, energy
  secondary: '#F97316', // Orange for fitness/energy
  secondaryLight: '#FB923C',
  secondaryDark: '#EA580C',

  // Accent colors
  accent: '#10B981', // Green for success
  warning: '#F59E0B', // Amber for warnings
  error: '#EF4444', // Red for errors

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
    background: '#0A0B0D', // Deepest dark
    surface: '#111318', // Card surfaces
    surfaceVariant: '#1A1D23', // Elevated surfaces
    text: '#F8FAFC', // Primary text
    textSecondary: '#94A3B8', // Secondary text
    textTertiary: '#64748B', // Tertiary text
    border: '#1E293B', // Borders
    switchThumb: '#E2E8F0',
    buttonDisabled: '#475569',
    modalBackground: '#0F1419',
    card: '#111318',

    // Focus-specific colors
    focusAccent: '#3B82F6', // Blue for focus mode
    focusBackground: '#1E3A8A', // Dark blue background for focus

    // Fit-specific colors
    fitAccent: '#F97316', // Orange for fitness mode
    fitBackground: '#9A3412', // Dark orange background for fit
  },
};

const fontFamily = {
  // Inter for content - modern, serious, readable
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',

  // Poppins for titles - more playful, rounded
  title: 'Poppins-Bold',
  titleMedium: 'Poppins-SemiBold',
};

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
