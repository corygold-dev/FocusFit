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
  condition: (progress: UserProgressData) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_focus',
    name: 'First Focus',
    description: 'Complete your first focus session',
    emoji: '🎯',
    condition: (progress) => progress.totalFocusSessions >= 1,
  },
  {
    id: 'first_workout',
    name: 'First Workout',
    description: 'Complete your first workout',
    emoji: '💪',
    condition: (progress) => progress.totalWorkouts >= 1,
  },
  {
    id: 'focus_streak_3',
    name: 'Focus Streak',
    description: '3-day focus streak',
    emoji: '🔥',
    condition: (progress) => progress.focusStreak >= 3,
  },
  {
    id: 'workout_streak_3',
    name: 'Workout Streak',
    description: '3-day workout streak',
    emoji: '💪',
    condition: (progress) => progress.workoutStreak >= 3,
  },
  {
    id: 'focus_streak_7',
    name: 'Focus Master',
    description: '7-day focus streak',
    emoji: '👑',
    condition: (progress) => progress.focusStreak >= 7,
  },
  {
    id: 'workout_streak_7',
    name: 'Workout Warrior',
    description: '7-day workout streak',
    emoji: '⚔️',
    condition: (progress) => progress.workoutStreak >= 7,
  },
  {
    id: 'focus_10',
    name: 'Focus Enthusiast',
    description: 'Complete 10 focus sessions',
    emoji: '🧠',
    condition: (progress) => progress.totalFocusSessions >= 10,
  },
  {
    id: 'workout_10',
    name: 'Workout Enthusiast',
    description: 'Complete 10 workouts',
    emoji: '🏋️',
    condition: (progress) => progress.totalWorkouts >= 10,
  },
  {
    id: 'focus_50',
    name: 'Focus Master',
    description: 'Complete 50 focus sessions',
    emoji: '🎓',
    condition: (progress) => progress.totalFocusSessions >= 50,
  },
  {
    id: 'workout_50',
    name: 'Workout Master',
    description: 'Complete 50 workouts',
    emoji: '🏆',
    condition: (progress) => progress.totalWorkouts >= 50,
  },
  {
    id: 'focus_time_10h',
    name: 'Time Keeper',
    description: '24 hours of total focus time',
    emoji: '⏰',
    condition: (progress) => progress.totalFocusDuration >= 24 * 60 * 60,
  },
  {
    id: 'workout_time_10h',
    name: 'Endurance',
    description: '2 hours of total workout time',
    emoji: '🏃',
    condition: (progress) => progress.totalWorkoutDuration >= 2 * 60 * 60,
  },
];

export function checkAchievements(
  currentProgress: UserProgressData,
  existingAchievements: string[] = [],
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
  return ACHIEVEMENTS.find((achievement) => achievement.id === id);
}
