import {
  ACHIEVEMENTS,
  checkAchievements,
  getAchievementById,
  UserProgressData,
} from '../achievements';

describe('achievements', () => {
  const baseProgress: UserProgressData = {
    totalFocusSessions: 0,
    totalWorkouts: 0,
    focusStreak: 0,
    workoutStreak: 0,
    totalFocusDuration: 0,
    totalWorkoutDuration: 0,
  };

  describe('checkAchievements', () => {
    it('should return empty array when no achievements are unlocked', () => {
      const result = checkAchievements(baseProgress);
      expect(result).toEqual([]);
    });

    it('should unlock first focus achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 1,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('first_focus');
    });

    it('should unlock first workout achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkouts: 1,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('first_workout');
    });

    it('should unlock 3-day focus streak achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        focusStreak: 3,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('focus_streak_3');
    });

    it('should unlock 3-day workout streak achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        workoutStreak: 3,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('workout_streak_3');
    });

    it('should unlock 7-day focus streak achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        focusStreak: 7,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('focus_streak_7');
    });

    it('should unlock 7-day workout streak achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        workoutStreak: 7,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('workout_streak_7');
    });

    it('should unlock 10 focus sessions achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 10,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('focus_10');
    });

    it('should unlock 10 workouts achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkouts: 10,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('workout_10');
    });

    it('should unlock 25 focus sessions (zen master) achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 25,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('zen_master');
    });

    it('should unlock 25 workouts (iron will) achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkouts: 25,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('iron_will');
    });

    it('should unlock 50 focus sessions achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 50,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('focus_50');
    });

    it('should unlock 50 workouts achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkouts: 50,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('workout_50');
    });

    it('should unlock 100 focus sessions (legend) achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 100,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('legend');
    });

    it('should unlock 100 workouts (champion) achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkouts: 100,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('champion');
    });

    it('should unlock 24 hours focus time achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusDuration: 24 * 60 * 60,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('focus_time_10h');
    });

    it('should unlock 2 hours workout time achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkoutDuration: 2 * 60 * 60,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('workout_time_10h');
    });

    it('should unlock 100 hours focus time (time lord) achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusDuration: 100 * 60 * 60,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('time_lord');
    });

    it('should unlock 10 hours workout time (endurance king) achievement', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalWorkoutDuration: 10 * 60 * 60,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('endurance_king');
    });

    it('should unlock century club with 100 total sessions', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 60,
        totalWorkouts: 40,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('century_club');
    });

    it('should unlock unstoppable with 30-day focus streak', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        focusStreak: 30,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('unstoppable');
    });

    it('should unlock unstoppable with 30-day workout streak', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        workoutStreak: 30,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('unstoppable');
    });

    it('should unlock multiple achievements at once', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 50,
        totalWorkouts: 25,
        focusStreak: 7,
        workoutStreak: 3,
      };

      const result = checkAchievements(progress);
      expect(result.length).toBeGreaterThan(5);
      expect(result).toContain('first_focus');
      expect(result).toContain('first_workout');
      expect(result).toContain('focus_streak_3');
      expect(result).toContain('focus_streak_7');
      expect(result).toContain('workout_streak_3');
      expect(result).toContain('focus_10');
      expect(result).toContain('workout_10');
      expect(result).toContain('zen_master');
      expect(result).toContain('iron_will');
      expect(result).toContain('focus_50');
    });

    it('should not return already unlocked achievements', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 10,
      };

      const existingAchievements = ['first_focus', 'focus_10'];
      const result = checkAchievements(progress, existingAchievements);

      expect(result).not.toContain('first_focus');
      expect(result).not.toContain('focus_10');
    });

    it('should only return new achievements', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 25,
      };

      const existingAchievements = ['first_focus', 'focus_10'];
      const result = checkAchievements(progress, existingAchievements);

      expect(result).toContain('zen_master');
      expect(result).not.toContain('first_focus');
      expect(result).not.toContain('focus_10');
    });

    it('should handle edge case of exactly meeting requirements', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 50,
        totalWorkouts: 50,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('focus_50');
      expect(result).toContain('workout_50');
      expect(result).toContain('century_club');
    });

    it('should handle zero progress correctly', () => {
      const result = checkAchievements(baseProgress);
      expect(result).toEqual([]);
    });

    it('should unlock all milestones when exceeding highest threshold', () => {
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 100,
      };

      const result = checkAchievements(progress);
      expect(result).toContain('first_focus');
      expect(result).toContain('focus_10');
      expect(result).toContain('zen_master');
      expect(result).toContain('focus_50');
      expect(result).toContain('legend');
    });
  });

  describe('getAchievementById', () => {
    it('should return achievement by id', () => {
      const achievement = getAchievementById('first_focus');

      expect(achievement).toBeDefined();
      expect(achievement?.id).toBe('first_focus');
      expect(achievement?.name).toBe('First Focus');
    });

    it('should return undefined for non-existent id', () => {
      const achievement = getAchievementById('non_existent');
      expect(achievement).toBeUndefined();
    });

    it('should return correct achievement data structure', () => {
      const achievement = getAchievementById('first_workout');

      expect(achievement).toHaveProperty('id');
      expect(achievement).toHaveProperty('name');
      expect(achievement).toHaveProperty('description');
      expect(achievement).toHaveProperty('emoji');
      expect(achievement).toHaveProperty('iconName');
      expect(achievement).toHaveProperty('iconColor');
      expect(achievement).toHaveProperty('condition');
    });

    it('should return achievement with working condition function', () => {
      const achievement = getAchievementById('first_focus');
      const progress: UserProgressData = {
        ...baseProgress,
        totalFocusSessions: 1,
      };

      expect(achievement?.condition(progress)).toBe(true);
    });

    it('should handle all achievement ids correctly', () => {
      const allIds = ACHIEVEMENTS.map(a => a.id);

      allIds.forEach(id => {
        const achievement = getAchievementById(id);
        expect(achievement).toBeDefined();
        expect(achievement?.id).toBe(id);
      });
    });
  });

  describe('ACHIEVEMENTS array', () => {
    it('should have unique ids', () => {
      const ids = ACHIEVEMENTS.map(a => a.id);
      const uniqueIds = new Set(ids);
      expect(ids.length).toBe(uniqueIds.size);
    });

    it('should have all required properties', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(achievement.id).toBeTruthy();
        expect(achievement.name).toBeTruthy();
        expect(achievement.description).toBeTruthy();
        expect(achievement.emoji).toBeTruthy();
        expect(achievement.iconName).toBeTruthy();
        expect(achievement.iconColor).toBeTruthy();
        expect(typeof achievement.condition).toBe('function');
      });
    });

    it('should have working condition functions for all achievements', () => {
      ACHIEVEMENTS.forEach(achievement => {
        expect(() => {
          achievement.condition(baseProgress);
        }).not.toThrow();
      });
    });
  });
});
