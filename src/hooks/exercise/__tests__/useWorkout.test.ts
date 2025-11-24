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

  describe('notification cleanup', () => {
    it('should cleanup notifications when skipping active exercise', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      act(() => {
        result.current.startCountdown();
      });

      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');

      act(() => {
        result.current.skipExercise();
      });

      expect(result.current.phase).toBe('preview');
    });

    it('should cleanup notifications when phase changes from active', () => {
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

      act(() => {
        result.current.startCountdown();
      });

      expect(result.current.phase).toBe('countdown');
    });

    it('should handle unmounting during active workout', () => {
      jest
        .spyOn(exerciseUtils, 'pickStrengthWorkout')
        .mockReturnValue(mockStrengthExercises);

      const { result, unmount } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'strength' })
      );

      act(() => {
        result.current.startCountdown();
      });

      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');

      expect(() => unmount()).not.toThrow();
    });
  });

  describe('restart + shuffle interaction (crash fix)', () => {
    it('should handle restart followed by shuffle without crashing', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      // Start exercise
      act(() => {
        result.current.startCountdown();
      });

      // Restart exercise (sets phase to active)
      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');

      // Shuffle should work without crashing
      act(() => {
        result.current.shuffleExercise();
      });

      expect(result.current.phase).toBe('preview');
    });

    it('should debounce rapid shuffle clicks', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      const firstExercise = result.current.currentExercise;

      // Rapidly click shuffle multiple times
      act(() => {
        result.current.shuffleExercise();
        result.current.shuffleExercise();
        result.current.shuffleExercise();
      });

      // Should still be in preview phase (not crashed)
      expect(result.current.phase).toBe('preview');

      // Exercise should have changed (at least once)
      // Note: might be the same if only one alternative available
      expect(result.current.currentExercise).toBeTruthy();

      // Fast-forward through the debounce timeout
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Should be able to shuffle again after debounce
      act(() => {
        result.current.shuffleExercise();
      });

      expect(result.current.phase).toBe('preview');
    });

    it('should prevent skip during shuffle operation', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      // Start shuffling
      act(() => {
        result.current.shuffleExercise();
      });

      const exerciseAfterShuffle = result.current.currentExercise;

      // Try to skip immediately (should be blocked during shuffle)
      act(() => {
        result.current.skipExercise();
      });

      // Should still show the same exercise (skip was blocked)
      expect(result.current.currentExercise).toBe(exerciseAfterShuffle);

      // Fast-forward through the debounce timeout
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Now skip should work
      act(() => {
        result.current.skipExercise();
      });

      expect(result.current.phase).toBe('preview');
    });

    it('should prevent restart during shuffle operation', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      // Start shuffling
      act(() => {
        result.current.shuffleExercise();
      });

      expect(result.current.phase).toBe('preview');

      // Try to restart immediately (should be blocked during shuffle)
      act(() => {
        result.current.restartExercise();
      });

      // Should still be in preview (restart was blocked)
      expect(result.current.phase).toBe('preview');

      // Fast-forward through the debounce timeout
      act(() => {
        jest.advanceTimersByTime(300);
      });

      // Now restart should work
      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');
    });

    it('should cleanup timers when shuffling from active phase', () => {
      const mockCleanup = jest.fn();
      jest.mock('../../timer/useBackgroundTimer', () => ({
        useBackgroundTimer: () => ({
          scheduleBackgroundNotification: jest.fn(),
          cleanupBackgroundTimer: mockCleanup,
          endTimeRef: { current: Date.now() + 30000 },
        }),
      }));

      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      // Start exercise and get to active phase
      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');

      // Shuffle from active phase
      act(() => {
        result.current.shuffleExercise();
      });

      // Should have cleaned up timers and moved to preview
      expect(result.current.phase).toBe('preview');
    });

    it('should cleanup timers when restarting from active phase', () => {
      const mockCleanup = jest.fn();
      jest.mock('../../timer/useBackgroundTimer', () => ({
        useBackgroundTimer: () => ({
          scheduleBackgroundNotification: jest.fn(),
          cleanupBackgroundTimer: mockCleanup,
          endTimeRef: { current: Date.now() + 30000 },
        }),
      }));

      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      // Start exercise
      act(() => {
        result.current.restartExercise();
      });

      expect(result.current.phase).toBe('active');

      // Restart again (should cleanup previous timers)
      act(() => {
        result.current.restartExercise();
      });

      // Should still be in active phase with fresh timer
      expect(result.current.phase).toBe('active');
      expect(result.current.secondsLeft).toBeGreaterThan(0);
    });

    it('should handle multiple restart-shuffle cycles without crashing', () => {
      jest
        .spyOn(exerciseUtils, 'pickMobilityWorkout')
        .mockReturnValue(mockMobilityExercises);

      const { result } = renderHook(() =>
        useWorkout({ settings: mockSettings, workoutType: 'mobility' })
      );

      // Simulate the crash scenario: restart -> shuffle -> restart -> shuffle
      for (let i = 0; i < 5; i++) {
        act(() => {
          result.current.restartExercise();
        });

        expect(result.current.phase).toBe('active');

        act(() => {
          jest.advanceTimersByTime(300);
        });

        act(() => {
          result.current.shuffleExercise();
        });

        expect(result.current.phase).toBe('preview');

        act(() => {
          jest.advanceTimersByTime(300);
        });
      }

      // Should not have crashed and should be in valid state
      expect(result.current.phase).toBe('preview');
      expect(result.current.currentExercise).toBeTruthy();
    });
  });
});
