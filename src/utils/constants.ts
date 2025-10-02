export type CategoryKey = 'upper' | 'lower' | 'mobility';
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

export const MIN_FOCUS_DURATION = 30;

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
  mobility: 'Mobility',
};

export const LOCAL_STORAGE_KEYS = {
  USER_SETTINGS: 'userSettings',
  USER_PROGRESS: 'userProgress',
  LAST_SYNC: 'lastSyncTime',
};

export const WORKOUT = {
  STRENGTH: {
    ROUNDS: 4,
    DURATION_PER_ROUND: 30,
    TOTAL_DURATION: 4 * 30,
  },
  MOBILITY: {
    DURATION_PER_EXERCISE: 60,
  },
};

export const FOCUS_PHRASES = [
  'Stay with it.',
  'One minute at a time.',
  "You're stronger than distraction.",
  'Keep pushing forward.',
  'This work matters.',
  'Focus creates results.',
  'Stay locked in.',
  'Your future self thanks you.',
  'Win this moment.',
  'Progress, not perfection.',
];

export const FOCUS_PHRASE_INTERVAL = 15000;

// Feedback Modal Constants
export const FEEDBACK_CATEGORIES = [
  { id: 'bug', label: 'Bug Report', icon: 'bug-report' },
  { id: 'feature', label: 'Feature Request', icon: 'lightbulb' },
  { id: 'ui', label: 'UI/UX Issue', icon: 'palette' },
  { id: 'performance', label: 'Performance', icon: 'speed' },
  { id: 'general', label: 'General Feedback', icon: 'chat' },
];

export const USER_TYPES = [
  { id: 'first_time', label: 'First time user' },
  { id: 'casual', label: 'Casual user (1-2 times/week)' },
  { id: 'regular', label: 'Regular user (3-5 times/week)' },
  { id: 'power', label: 'Power user (daily)' },
];
