// ===== Type Definitions =====
export type CategoryKey = 'upper' | 'lower' | 'full' | 'mobility';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ThemeMode = 'light' | 'dark' | 'system';

// ===== Timer Constants =====
export const TIMER = {
  DEFAULT_MINUTES: 25,
  ONE_SECOND: 1000,
  PRESET_MINUTES: [15, 25, 50],
};

// ===== Settings Constants =====
export const DIFFICULTY_LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];
export const USER_SETTINGS_STORAGE_KEY = 'userSettings';
export const EQUIPMENT_OPTIONS = ['TRX', 'Kettlebell', 'Pull-up Bar', 'Resistance Band'];
export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];

// ===== UI Constants =====
export const SLIDER = {
  MIN: 5,
  MAX: 120,
  STEP: 1,
};

export const CATEGORY_LABELS: Record<CategoryKey, string> = {
  upper: 'Upper Body',
  lower: 'Lower Body',
  full: 'Full Body',
  mobility: 'Mobility',
};
