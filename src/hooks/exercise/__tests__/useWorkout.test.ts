import { Exercise } from '@/src/lib/exercises';
import * as exerciseUtils from '@/src/utils/exerciseUtils';
import { UserSettings } from '@/src/utils/exerciseUtils';
import { act, renderHook } from '@testing-library/react-native';
import { useWorkout } from '../useWorkout';

// Mock dependencies
jest.mock('@/src/providers', () => ({
  useSounds: () => ({
    playSmallBeep: jest.fn(),
    playFinalBeep: jest.fn(),
    playEndSound: jest.fn(),
  }),
  useAuth: () => ({
    user: { uid: 'test-user-123', email: 'test@example.com' },
  }),
  useBackendData: () => ({
    saveUserProgress: jest.fn().mockResolvedValue(undefined),
    saveWorkoutSession: jest.fn().mockResolvedValue(undefined),
    getUserProgress: jest.fn().mockResolvedValue({ workoutStreak: 1 }),
  }),
}));

jest.mock('@/src/utils/notifications', () => ({
  scheduleExerciseNotification: jest.fn().mockResolvedValue('notification-id'),
}));

jest.mock('../../timer/useBackgroundTimer', () => ({
  useBackgroundTimer: () => ({
    scheduleBackgroundNotification: jest.fn(),
    cleanupBackgroundTimer: jest.fn(),
    endTimeRef: { current: null },
  }),
}));

jest.mock('../../timer', () => ({
  useInterval: jest.fn(),
}));

describe('useWorkout', () => {
  const mockSettings: UserSettings = {
    difficulty: 'medium',
    equipment: [],
    excludedExercises: [],
  };

  const mockStrengthExercises: Exercise[] = [
    {
      name: 'Push-ups',
      category: 'upper',
      duration: 30,
      difficulty: ['medium'],
      instructions: ['Do push-ups'],
      equipment: null,
    },
    {
      name: 'Squats',
      category: 'lower',
      duration: 30,
      difficulty: ['medium'],
      instructions: ['Do squats'],
      equipment: null,
    },
  ];

  const mockMobilityExercises: Exercise[] = [
    {
      name: 'Neck Rolls',
      category: 'mobility',
      duration: 30,
      difficulty: ['easy', 'medium'],
      instructions: ['Roll neck'],
      equipment: null,
    },
    {
      name: 'Shoulder Rolls',
      category: 'mobility',
      duration: 30,
      difficulty: ['easy', 'medium'],
      instructions: ['Roll shoulders'],
      equipment: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  describe('initialization', () => {
    it('should initialize with preview phase for strength workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      expect(result.current.phase).toBe('preview');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should initialize with preview phase for mobility workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      expect(result.current.phase).toBe('preview');
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should set error when no exercises are available', () => {
      jest.spyOn(exerciseUtils, 'pickStrengthWorkout').mockReturnValue([]);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      expect(result.current.error).toBe(
        'No exercises available with current settings'
      );
    });

    it('should handle errors during workout initialization', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockImplementation(() => {
          throw new Error('Test error');
        });

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      expect(result.current.error).toBe('Test error');
    });
  });

  describe('startCountdown', () => {
    it('should start countdown from 3 seconds', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      act(() => {
        result.current.startCountdown();
      });

      expect(result.current.phase).toBe('countdown');
      expect(result.current.secondsLeft).toBe(3);
      expect(result.current.totalDuration).toBe(3);
    });
  });

  describe('skipExercise', () => {
    it('should skip to next exercise in mobility workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      const firstExercise = result.current.currentExercise;

      act(() => {
        result.current.skipExercise();
      });

      expect(result.current.currentExercise).not.toBe(firstExercise);
      expect(result.current.phase).toBe('preview');
    });

    it('should complete workout when skipping last exercise', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue([mockMobilityExercises[0]]);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      act(() => {
        result.current.skipExercise();
      });

      expect(result.current.phase).toBe('completed');
    });
  });

  describe('restartExercise', () => {
    it('should restart exercise with correct duration for strength', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');
      expect(result.current.secondsLeft).toBeGreaterThan(0);
    });

    it('should restart exercise with correct duration for mobility', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');
      expect(result.current.secondsLeft).toBe(30);
    });
  });

  describe('shuffleExercise', () => {
    it('should shuffle exercise in workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      const initialExercise = result.current.currentExercise;

      act(() => {
        result.current.shuffleExercise();
      });

      expect(result.current.phase).toBe('preview');
    });

    it('should not shuffle when only one exercise', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue([mockMobilityExercises[0]]);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      const initialExercise = result.current.currentExercise;

      act(() => {
        result.current.shuffleExercise();
      });

      expect(result.current.currentExercise).toBe(initialExercise);
    });
  });

  describe('progress calculation', () => {
    it('should calculate progress correctly', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      expect(result.current.progress).toBe(0);

      act(() => {
        result.current.startCountdown();
      });

      expect(result.current.progress).toBeGreaterThanOrEqual(0);
      expect(result.current.progress).toBeLessThanOrEqual(1);
    });
  });

  describe('current exercise', () => {
    it('should return current exercise name for mobility workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      expect(result.current.currentExercise).toBe('Neck Rolls');
    });

    it('should return current exercise name for strength workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      expect(result.current.currentExercise).toBe('Push-ups');
    });

    it('should handle empty exercise list', () => {
      jest.spyOn(exerciseUtils, 'pickStrengthWorkout').mockReturnValue([]);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      expect(result.current.currentExercise).toBe('');
    });
  });

  describe('workout type changes', () => {
    it('should reload exercises when workout type changes', () => {
      const pickStrengthSpy = jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);
      const pickMobilitySpy = jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { rerender } = renderHook(
        ({ workoutType }: { workoutType: 'strength' | 'mobility' }) =>
          useWorkout({ settings: mockSettings, workoutType }),
        { initialProps: { workoutType: 'strength' as const } }
      );

      expect(pickStrengthSpy).toHaveBeenCalled();

      rerender({ workoutType: 'mobility' as const });

      expect(pickMobilitySpy).toHaveBeenCalled();
    });
  });

  describe('settings changes', () => {
    it('should reload exercises when settings change', () => {
      const pickStrengthSpy = jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { rerender } = renderHook(
        ({ settings }: { settings: UserSettings }) =>
          useWorkout({ settings, workoutType: 'strength' }),
        { initialProps: { settings: mockSettings } }
      );

      expect(pickStrengthSpy).toHaveBeenCalledTimes(1);

      const newSettings = { ...mockSettings, difficulty: 'hard' as const };
      rerender({ settings: newSettings });

      expect(pickStrengthSpy).toHaveBeenCalledTimes(2);
    });
  });
});
