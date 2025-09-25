import { generateClient } from 'aws-amplify/api';

export interface UserSettings {
  difficulty: 'easy' | 'medium' | 'hard';
  equipment: string[];
  excludedExercises: string[];
  theme?: string;
  notifications?: boolean;
}

export interface WorkoutSession {
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
        console.error('GraphQL errors in getUserSettings:', result.errors);
      }

      const data = 'data' in result ? result.data : null;

      if (!data.getUserSettings) return null;

      return {
        difficulty: data.getUserSettings.difficulty as 'easy' | 'medium' | 'hard',
        equipment: data.getUserSettings.equipment,
        excludedExercises: data.getUserSettings.excludedExercises,
        theme: data.getUserSettings.theme || undefined,
        notifications: true,
      };
    } catch (error) {
      console.error('Error fetching user settings:', error);
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
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          },
        });
        return !!('data' in result ? result.data?.createUserSettings : null);
      }
    } catch (error) {
      console.error('Error saving user settings:', error);
      return false;
    }
  },

  // Note: WorkoutSession and UserProgress operations would need their own schema
  // For now, these will just return success for local storage
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async saveWorkoutSession(_session: WorkoutSession): Promise<boolean> {
    // TODO: Implement when WorkoutSession schema is created
    console.log('WorkoutSession save not implemented yet');
    return true;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserWorkoutHistory(_userId: string, _limit?: number): Promise<WorkoutSession[]> {
    // TODO: Implement when WorkoutSession schema is created
    console.log('WorkoutSession history not implemented yet');
    return [];
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getUserProgress(_userId: string): Promise<UserProgress | null> {
    // TODO: Implement when UserProgress schema is created
    console.log('UserProgress not implemented yet');
    return null;
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async updateUserProgress(_userId: string, _progress: UserProgress): Promise<boolean> {
    // TODO: Implement when UserProgress schema is created
    console.log('UserProgress update not implemented yet');
    return true;
  },
};
