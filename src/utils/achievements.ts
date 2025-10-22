export interface UserProgressData {
  totalFocusSessions: number;
  totalWorkouts: number;
  focusStreak: number;
  workoutStreak: number;
  totalFocusDuration: number;
  totalWorkoutDuration: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  emoji: string;
  iconName: string;
  iconColor: string;
  condition: (progress: UserProgressData) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_focus',
    name: 'First Focus',
    description: 'Complete your first focus session',
    emoji: '🎯',
    iconName: 'psychology',
    iconColor: '#2196F3',
    condition: progress => progress.totalFocusSessions >= 1,
  },
  {
    id: 'first_workout',
    name: 'First Workout',
    description: 'Complete your first workout',
    emoji: '💪',
    iconName: 'fitness-center',
    iconColor: '#FF9800',
    condition: progress => progress.totalWorkouts >= 1,
  },
  {
    id: 'focus_streak_3',
    name: 'Focus Streak',
    description: '3-day focus streak',
    emoji: '🔥',
    iconName: 'local-fire-department',
    iconColor: '#F44336',
    condition: progress => progress.focusStreak >= 3,
  },
  {
    id: 'workout_streak_3',
    name: 'Workout Streak',
    description: '3-day workout streak',
    emoji: '💪',
    iconName: 'trending-up',
    iconColor: '#FF9800',
    condition: progress => progress.workoutStreak >= 3,
  },
  {
    id: 'focus_streak_7',
    name: 'Focus Master',
    description: '7-day focus streak',
    emoji: '👑',
    iconName: 'star',
    iconColor: '#9C27B0',
    condition: progress => progress.focusStreak >= 7,
  },
  {
    id: 'workout_streak_7',
    name: 'Workout Warrior',
    description: '7-day workout streak',
    emoji: '⚔️',
    iconName: 'sports-mma',
    iconColor: '#FF5722',
    condition: progress => progress.workoutStreak >= 7,
  },
  {
    id: 'focus_10',
    name: 'Focus Enthusiast',
    description: 'Complete 10 focus sessions',
    emoji: '🧠',
    iconName: 'self-improvement',
    iconColor: '#2196F3',
    condition: progress => progress.totalFocusSessions >= 10,
  },
  {
    id: 'workout_10',
    name: 'Workout Enthusiast',
    description: 'Complete 10 workouts',
    emoji: '🏋️',
    iconName: 'sports',
    iconColor: '#FF9800',
    condition: progress => progress.totalWorkouts >= 10,
  },
  {
    id: 'focus_50',
    name: 'Focus Master',
    description: 'Complete 50 focus sessions',
    emoji: '🎓',
    iconName: 'school',
    iconColor: '#9C27B0',
    condition: progress => progress.totalFocusSessions >= 50,
  },
  {
    id: 'workout_50',
    name: 'Workout Master',
    description: 'Complete 50 workouts',
    emoji: '🏆',
    iconName: 'emoji-events',
    iconColor: '#FFD700',
    condition: progress => progress.totalWorkouts >= 50,
  },
  {
    id: 'focus_time_10h',
    name: 'Time Keeper',
    description: '24 hours of total focus time',
    emoji: '⏰',
    iconName: 'schedule',
    iconColor: '#607D8B',
    condition: progress => progress.totalFocusDuration >= 24 * 60 * 60,
  },
  {
    id: 'workout_time_10h',
    name: 'Endurance',
    description: '2 hours of total workout time',
    emoji: '🏃',
    iconName: 'timer',
    iconColor: '#795548',
    condition: progress => progress.totalWorkoutDuration >= 2 * 60 * 60,
  },
  {
    id: 'century_club',
    name: 'Century Club',
    description: 'Complete 100 total sessions (focus + workouts)',
    emoji: '💯',
    iconName: 'hundred',
    iconColor: '#FFD700',
    condition: progress =>
      progress.totalFocusSessions + progress.totalWorkouts >= 100,
  },
  {
    id: 'unstoppable',
    name: 'Unstoppable',
    description: '30-day streak (focus or workout)',
    emoji: '🚀',
    iconName: 'rocket-launch',
    iconColor: '#E91E63',
    condition: progress =>
      progress.focusStreak >= 30 || progress.workoutStreak >= 30,
  },
  {
    id: 'zen_master',
    name: 'Zen Master',
    description: 'Complete 25 focus sessions',
    emoji: '🧘',
    iconName: 'self-improvement',
    iconColor: '#4CAF50',
    condition: progress => progress.totalFocusSessions >= 25,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Complete 25 workouts',
    emoji: '💪',
    iconName: 'fitness-center',
    iconColor: '#FF5722',
    condition: progress => progress.totalWorkouts >= 25,
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Complete 100 focus sessions',
    emoji: '🏆',
    iconName: 'emoji-events',
    iconColor: '#FFD700',
    condition: progress => progress.totalFocusSessions >= 100,
  },
  {
    id: 'champion',
    name: 'Champion',
    description: 'Complete 100 workouts',
    emoji: '🥇',
    iconName: 'sports',
    iconColor: '#FFD700',
    condition: progress => progress.totalWorkouts >= 100,
  },
  {
    id: 'time_lord',
    name: 'Time Lord',
    description: '100 hours of total focus time',
    emoji: '🕰️',
    iconName: 'schedule',
    iconColor: '#9C27B0',
    condition: progress => progress.totalFocusDuration >= 100 * 60 * 60,
  },
  {
    id: 'endurance_king',
    name: 'Endurance King',
    description: '10 hours of total workout time',
    emoji: '👑',
    iconName: 'timer',
    iconColor: '#FF9800',
    condition: progress => progress.totalWorkoutDuration >= 10 * 60 * 60,
  },
];

export function checkAchievements(
  currentProgress: UserProgressData,
  existingAchievements: string[] = []
): string[] {
  const newAchievements: string[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (existingAchievements.includes(achievement.id)) {
      continue;
    }

    if (achievement.condition(currentProgress)) {
      newAchievements.push(achievement.id);
    }
  }

  return newAchievements;
}

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(achievement => achievement.id === id);
}
