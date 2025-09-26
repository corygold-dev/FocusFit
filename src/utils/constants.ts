export type CategoryKey = 'upper' | 'lower' | 'full' | 'mobility';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ThemeMode = 'light' | 'dark' | 'system';

export const TIMER = {
  DEFAULT_MINUTES: 25,
  ONE_SECOND: 1000,
  PRESET_MINUTES: [
    { label: '15 min', value: 15 },
    { label: '25 min', value: 25 },
    { label: '45 min', value: 45 },
    { label: '60 min', value: 60 },
  ],
};

export const DIFFICULTY_LEVELS: Difficulty[] = ['easy', 'medium', 'hard'];
export const USER_SETTINGS_STORAGE_KEY = 'userSettings';
export const EQUIPMENT_OPTIONS = ['TRX', 'Kettlebell', 'Pull-up Bar', 'Resistance Band'];
export const THEME_MODES: ThemeMode[] = ['light', 'dark', 'system'];

export const THEME_MODE_STORAGE_KEY = 'themeMode';
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

export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: 'userSettings',
  USER_PROGRESS: 'userProgress',
  LAST_SYNC: 'lastSyncTime',
};
