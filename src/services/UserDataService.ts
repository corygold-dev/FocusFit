import { generateClient } from 'aws-amplify/api';
import _ from 'lodash';

export interface UserSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  excludedExercises: string[];
  theme?: string;
  morningReminders?: boolean;
  afternoonReminders?: boolean;
  timerEndNotifications?: boolean;
}

export interface WorkoutSession {
  userId: string;
  sessionId: string;
  exercises: string[];
  duration?: number;
  completedAt?: Date;
}

export interface UserProgress {
  totalWorkouts: number;
  totalDuration: number;
  streak: number;
  lastWorkoutDate?: Date;
  achievements: string[];
}

const client = generateClient();

const GET_USER_SETTINGS = `
  query GetUserSettings($userId: ID!) {
    getUserSettings(userId: $userId) {
      userId
      difficulty
      equipment
      excludedExercises
      theme
      morningReminders
      afternoonReminders
      timerEndNotifications
      createdAt
      updatedAt
    }
  }
`;

const CREATE_USER_SETTINGS = `
  mutation CreateUserSettings($input: CreateUserSettingsInput!) {
    createUserSettings(input: $input) {
      userId
      difficulty
      equipment
      excludedExercises
      theme
      morningReminders
      afternoonReminders
      timerEndNotifications
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER_SETTINGS = `
  mutation UpdateUserSettings($input: UpdateUserSettingsInput!) {
    updateUserSettings(input: $input) {
      userId
      difficulty
      equipment
      excludedExercises
      theme
      morningReminders
      afternoonReminders
      timerEndNotifications
      createdAt
      updatedAt
    }
  }
`;

const CREATE_WORKOUT_SESSION = `
  mutation CreateWorkoutSession($input: CreateWorkoutSessionInput!) {
    createWorkoutSession(input: $input) {
      userId
      sessionId
      exercises
      duration
      completedAt
      createdAt
      updatedAt
    }
  }
`;

const LIST_WORKOUT_SESSIONS = `
  query ListWorkoutSessions($userId: ID!, $limit: Int) {
    listWorkoutSessions(userId: $userId, limit: $limit) {
      items {
        userId
        sessionId
        exercises
        duration
        completedAt
        createdAt
        updatedAt
      }
    }
  }
`;

const GET_USER_PROGRESS = `
  query GetUserProgress($userId: ID!) {
    getUserProgress(userId: $userId) {
      userId
      totalWorkouts
      totalDuration
      streak
      lastWorkoutDate
      achievements
      createdAt
      updatedAt
    }
  }
`;

const CREATE_USER_PROGRESS = `
  mutation CreateUserProgress($input: CreateUserProgressInput!) {
    createUserProgress(input: $input) {
      userId
      totalWorkouts
      totalDuration
      streak
      lastWorkoutDate
      achievements
      createdAt
      updatedAt
    }
  }
`;

const UPDATE_USER_PROGRESS = `
  mutation UpdateUserProgress($input: UpdateUserProgressInput!) {
    updateUserProgress(input: $input) {
      userId
      totalWorkouts
      totalDuration
      streak
      lastWorkoutDate
      achievements
      createdAt
      updatedAt
    }
  }
`;

export const UserDataService = {
  async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const result = await client.graphql({
        query: GET_USER_SETTINGS,
        variables: { userId },
      });

      if ('errors' in result && result.errors) {
        return null;
      }

      const data = 'data' in result ? result.data : null;

      if (!data.getUserSettings) return null;

      return {
        difficulty: data.getUserSettings.difficulty as 'easy' | 'medium' | 'hard',
        equipment: data.getUserSettings.equipment,
        excludedExercises: data.getUserSettings.excludedExercises,
        theme: data.getUserSettings.theme || undefined,
        morningReminders: data.getUserSettings.morningReminders || true,
        afternoonReminders: data.getUserSettings.afternoonReminders || true,
        timerEndNotifications: data.getUserSettings.timerEndNotifications || true,
      };
    } catch {
      return null;
    }
  },

  async saveUserSettings(userId: string, settings: UserSettings): Promise<boolean> {
    try {
      const existing = await this.getUserSettings(userId);

      if (existing) {
        const result = await client.graphql({
          query: UPDATE_USER_SETTINGS,
          variables: {
            input: {
              userId,
              difficulty: settings.difficulty,
              equipment: settings.equipment,
              excludedExercises: settings.excludedExercises,
              theme: settings.theme,
              morningReminders: settings.morningReminders,
              afternoonReminders: settings.afternoonReminders,
              timerEndNotifications: settings.timerEndNotifications,
              updatedAt: new Date().toISOString(),
            },
          },
        });
        return !!('data' in result ? result.data?.updateUserSettings : null);
      } else {
        const result = await client.graphql({
          query: CREATE_USER_SETTINGS,
          variables: {
            input: {
              userId,
              difficulty: settings.difficulty,
              equipment: settings.equipment,
              excludedExercises: settings.excludedExercises,
              theme: settings.theme,
              morningReminders: settings.morningReminders,
              afternoonReminders: settings.afternoonReminders,
              timerEndNotifications: settings.timerEndNotifications,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        });
        return !!('data' in result ? result.data?.createUserSettings : null);
      }
    } catch {
      return false;
    }
  },

  async saveWorkoutSession(session: WorkoutSession): Promise<boolean> {
    try {
      const result = await client.graphql({
        query: CREATE_WORKOUT_SESSION,
        variables: {
          input: {
            userId: session.userId,
            sessionId: session.sessionId,
            exercises: session.exercises,
            duration: session.duration,
            completedAt: session.completedAt?.toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });

      if ('errors' in result && result.errors) {
        return false;
      }

      return !!('data' in result ? result.data?.createWorkoutSession : null);
    } catch {
      return false;
    }
  },

  async getUserWorkoutHistory(userId: string, limit: number = 50): Promise<WorkoutSession[]> {
    try {
      const result = await client.graphql({
        query: LIST_WORKOUT_SESSIONS,
        variables: {
          userId,
          limit,
        },
      });

      if ('errors' in result && result.errors) {
        return [];
      }

      const data = 'data' in result ? result.data : null;
      const sessions = data?.listWorkoutSessions?.items || [];

      return sessions.map(
        (session: {
          userId: string;
          sessionId: string;
          exercises: string[];
          duration?: number;
          completedAt?: string;
        }) => ({
          userId: session.userId,
          sessionId: session.sessionId,
          exercises: session.exercises,
          duration: session.duration,
          completedAt: session.completedAt ? new Date(session.completedAt) : undefined,
        }),
      );
    } catch {
      return [];
    }
  },

  async getUserProgress(userId: string): Promise<UserProgress | null> {
    try {
      const result = await client.graphql({
        query: GET_USER_PROGRESS,
        variables: { userId },
      });

      if ('errors' in result && result.errors) {
        return null;
      }

      const data = 'data' in result ? result.data : null;

      if (!data?.getUserProgress) {
        return null;
      }

      const progress = data.getUserProgress;

      return {
        totalWorkouts: progress.totalWorkouts,
        totalDuration: progress.totalDuration,
        streak: progress.streak,
        lastWorkoutDate: progress.lastWorkoutDate ? new Date(progress.lastWorkoutDate) : undefined,
        achievements: progress.achievements,
      };
    } catch {
      return null;
    }
  },

  async updateUserProgress(
    userId: string,
    progress: Omit<UserProgress, 'streak'>,
  ): Promise<boolean> {
    try {
      const existing = await this.getUserProgress(userId);

      if (existing) {
        const currentDate = new Date();
        const lastWorkoutDate = existing.lastWorkoutDate
          ? new Date(existing.lastWorkoutDate)
          : null;

        const daysDiff = lastWorkoutDate
          ? Math.floor((currentDate.getTime() - lastWorkoutDate.getTime()) / (1000 * 60 * 60 * 24))
          : null;

        let newStreak;
        if (daysDiff === null) {
          newStreak = 1;
        } else if (daysDiff === 1) {
          newStreak = existing.streak + 1;
        } else if (daysDiff > 1) {
          newStreak = 1;
        } else {
          newStreak = existing.streak;
        }

        const updatedProgress = {
          totalWorkouts: existing.totalWorkouts + progress.totalWorkouts,
          totalDuration: existing.totalDuration + progress.totalDuration,
          streak: newStreak,
          lastWorkoutDate: progress.lastWorkoutDate,
          achievements: _.union(existing.achievements, progress.achievements),
        };

        const result = await client.graphql({
          query: UPDATE_USER_PROGRESS,
          variables: {
            input: {
              userId,
              totalWorkouts: updatedProgress.totalWorkouts,
              totalDuration: updatedProgress.totalDuration,
              streak: updatedProgress.streak,
              lastWorkoutDate: updatedProgress.lastWorkoutDate
                ? updatedProgress.lastWorkoutDate instanceof Date
                  ? updatedProgress.lastWorkoutDate.toISOString()
                  : new Date(updatedProgress.lastWorkoutDate).toISOString()
                : undefined,
              achievements: updatedProgress.achievements,
              updatedAt: new Date().toISOString(),
            },
          },
        });
        return !!('data' in result ? result.data?.updateUserProgress : null);
      } else {
        const result = await client.graphql({
          query: CREATE_USER_PROGRESS,
          variables: {
            input: {
              userId,
              totalWorkouts: progress.totalWorkouts,
              totalDuration: progress.totalDuration,
              streak: 1,
              lastWorkoutDate: progress.lastWorkoutDate
                ? progress.lastWorkoutDate instanceof Date
                  ? progress.lastWorkoutDate.toISOString()
                  : new Date(progress.lastWorkoutDate).toISOString()
                : undefined,
              achievements: progress.achievements,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        });
        return !!('data' in result ? result.data?.createUserProgress : null);
      }
    } catch {
      return false;
    }
  },
};
