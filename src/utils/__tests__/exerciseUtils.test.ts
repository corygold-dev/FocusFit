import { exercises } from '@/src/lib/exercises';
import {
  countExcludedExercises,
  getFilteredExercisesByCategory,
  pickMobilityWorkout,
  pickStrengthWorkout,
  UserSettings,
} from '../exerciseUtils';

describe('exerciseUtils', () => {
  const baseSettings: UserSettings = {
    difficulty: 'medium',
    equipment: [],
    excludedExercises: [],
  };

  describe('pickStrengthWorkout', () => {
    it('should return 2 exercises (upper and lower)', () => {
      const result = pickStrengthWorkout(baseSettings);

      expect(result).toHaveLength(2);
      expect(result[0].category).toBe('upper');
      expect(result[1].category).toBe('lower');
    });

    it('should filter by difficulty', () => {
      const easySettings: UserSettings = {
        ...baseSettings,
        difficulty: 'easy',
      };

      const result = pickStrengthWorkout(easySettings);

      result.forEach(exercise => {
        expect(exercise.difficulty).toContain('easy');
      });
    });

    it('should filter by equipment availability', () => {
      const settings: UserSettings = {
        ...baseSettings,
        equipment: ['desk'],
      };

      const result = pickStrengthWorkout(settings);

      result.forEach(exercise => {
        if (exercise.equipment) {
          exercise.equipment.forEach(eq => {
            expect(settings.equipment).toContain(eq);
          });
        }
      });
    });

    it('should exclude specified exercises', () => {
      const settings: UserSettings = {
        ...baseSettings,
        excludedExercises: ['Push-ups', 'Squats'],
      };

      const result = pickStrengthWorkout(settings);

      result.forEach(exercise => {
        expect(settings.excludedExercises).not.toContain(exercise.name);
      });
    });

    it('should not include mobility exercises', () => {
      const result = pickStrengthWorkout(baseSettings);

      result.forEach(exercise => {
        expect(exercise.category).not.toBe('mobility');
      });
    });

    it('should handle multiple equipment types', () => {
      const settings: UserSettings = {
        ...baseSettings,
        equipment: ['desk', 'chair', 'bodyweight'],
      };

      const result = pickStrengthWorkout(settings);

      expect(result.length).toBeGreaterThan(0);
      result.forEach(exercise => {
        if (exercise.equipment) {
          exercise.equipment.forEach(eq => {
            expect(settings.equipment).toContain(eq);
          });
        }
      });
    });

    it('should work with hard difficulty', () => {
      const settings: UserSettings = {
        ...baseSettings,
        difficulty: 'hard',
      };

      const result = pickStrengthWorkout(settings);

      result.forEach(exercise => {
        expect(exercise.difficulty).toContain('hard');
      });
    });

    it('should handle empty equipment (bodyweight only)', () => {
      const settings: UserSettings = {
        ...baseSettings,
        equipment: [],
      };

      const result = pickStrengthWorkout(settings);

      result.forEach(exercise => {
        expect(exercise.equipment).toBeNull();
      });
    });

    it('should return different exercises on multiple calls (randomness)', () => {
      const results = new Set();

      for (let i = 0; i < 10; i++) {
        const result = pickStrengthWorkout(baseSettings);
        results.add(result.map(e => e.name).join(','));
      }

      expect(results.size).toBeGreaterThan(1);
    });

    it('should handle when no upper body exercises are available', () => {
      const upperExercises = exercises
        .filter(e => e.category === 'upper' && e.difficulty.includes('medium'))
        .map(e => e.name);

      const settings: UserSettings = {
        ...baseSettings,
        excludedExercises: upperExercises,
      };

      const result = pickStrengthWorkout(settings);

      expect(result.length).toBeLessThanOrEqual(1);
    });

    it('should handle when no lower body exercises are available', () => {
      const lowerExercises = exercises
        .filter(e => e.category === 'lower' && e.difficulty.includes('medium'))
        .map(e => e.name);

      const settings: UserSettings = {
        ...baseSettings,
        excludedExercises: lowerExercises,
      };

      const result = pickStrengthWorkout(settings);

      expect(result.length).toBeLessThanOrEqual(1);
    });
  });

  describe('pickMobilityWorkout', () => {
    it('should return 2 mobility exercises', () => {
      const result = pickMobilityWorkout(baseSettings);

      expect(result).toHaveLength(2);
      result.forEach(exercise => {
        expect(exercise.category).toBe('mobility');
      });
    });

    it('should return 2 different mobility exercises', () => {
      const result = pickMobilityWorkout(baseSettings);

      if (result.length === 2) {
        expect(result[0].name).not.toBe(result[1].name);
      }
    });

    it('should filter by difficulty', () => {
      const easySettings: UserSettings = {
        ...baseSettings,
        difficulty: 'easy',
      };

      const result = pickMobilityWorkout(easySettings);

      result.forEach(exercise => {
        expect(exercise.difficulty).toContain('easy');
      });
    });

    it('should filter by equipment availability', () => {
      const settings: UserSettings = {
        ...baseSettings,
        equipment: ['chair'],
      };

      const result = pickMobilityWorkout(settings);

      result.forEach(exercise => {
        if (exercise.equipment) {
          exercise.equipment.forEach(eq => {
            expect(settings.equipment).toContain(eq);
          });
        }
      });
    });

    it('should exclude specified exercises', () => {
      const settings: UserSettings = {
        ...baseSettings,
        excludedExercises: ['Neck Rolls', 'Shoulder Rolls'],
      };

      const result = pickMobilityWorkout(settings);

      result.forEach(exercise => {
        expect(settings.excludedExercises).not.toContain(exercise.name);
      });
    });

    it('should only include mobility exercises', () => {
      const result = pickMobilityWorkout(baseSettings);

      result.forEach(exercise => {
        expect(exercise.category).toBe('mobility');
      });
    });

    it('should handle empty equipment (bodyweight only)', () => {
      const settings: UserSettings = {
        ...baseSettings,
        equipment: [],
      };

      const result = pickMobilityWorkout(settings);

      result.forEach(exercise => {
        expect(exercise.equipment).toBeNull();
      });
    });

    it('should return different exercises on multiple calls (randomness)', () => {
      const results = new Set();

      for (let i = 0; i < 10; i++) {
        const result = pickMobilityWorkout(baseSettings);
        results.add(result.map(e => e.name).join(','));
      }

      expect(results.size).toBeGreaterThan(1);
    });

    it('should handle when only one mobility exercise is available', () => {
      const mobilityExercises = exercises.filter(
        e => e.category === 'mobility' && e.difficulty.includes('medium')
      );

      const settings: UserSettings = {
        ...baseSettings,
        excludedExercises: mobilityExercises.slice(1).map(e => e.name),
      };

      const result = pickMobilityWorkout(settings);

      expect(result.length).toBeLessThanOrEqual(1);
    });
  });

  describe('getFilteredExercisesByCategory', () => {
    it('should group exercises by category', () => {
      const result = getFilteredExercisesByCategory('medium');

      expect(result).toHaveProperty('upper');
      expect(result).toHaveProperty('lower');
      expect(result).toHaveProperty('mobility');
    });

    it('should filter by difficulty', () => {
      const result = getFilteredExercisesByCategory('easy');

      Object.values(result).forEach(categoryExercises => {
        categoryExercises.forEach(exercise => {
          expect(exercise.difficulty).toContain('easy');
        });
      });
    });

    it('should filter by equipment', () => {
      const result = getFilteredExercisesByCategory('medium', ['desk']);

      Object.values(result).forEach(categoryExercises => {
        categoryExercises.forEach(exercise => {
          if (exercise.equipment) {
            exercise.equipment.forEach(eq => {
              expect(['desk']).toContain(eq);
            });
          }
        });
      });
    });

    it('should handle empty equipment array (bodyweight only)', () => {
      const result = getFilteredExercisesByCategory('medium', []);

      Object.values(result).forEach(categoryExercises => {
        categoryExercises.forEach(exercise => {
          expect(exercise.equipment).toBeNull();
        });
      });
    });

    it('should return all categories even if some are empty', () => {
      const result = getFilteredExercisesByCategory('hard', []);

      expect(typeof result).toBe('object');
    });

    it('should handle hard difficulty', () => {
      const result = getFilteredExercisesByCategory('hard');

      Object.values(result).forEach(categoryExercises => {
        categoryExercises.forEach(exercise => {
          expect(exercise.difficulty).toContain('hard');
        });
      });
    });

    it('should handle multiple equipment types', () => {
      const result = getFilteredExercisesByCategory('medium', [
        'desk',
        'chair',
      ]);

      Object.values(result).forEach(categoryExercises => {
        categoryExercises.forEach(exercise => {
          if (exercise.equipment) {
            exercise.equipment.forEach(eq => {
              expect(['desk', 'chair']).toContain(eq);
            });
          }
        });
      });
    });
  });

  describe('countExcludedExercises', () => {
    it('should return 0 when no exercises are excluded', () => {
      const result = countExcludedExercises([], 'medium');

      expect(result).toBe(0);
    });

    it('should count valid excluded exercises', () => {
      const validExerciseNames = exercises
        .filter(e => e.difficulty.includes('medium'))
        .slice(0, 3)
        .map(e => e.name);

      const result = countExcludedExercises(validExerciseNames, 'medium');

      expect(result).toBe(3);
    });

    it('should not count exercises that do not match difficulty', () => {
      const hardOnlyExercises = exercises
        .filter(
          e => e.difficulty.includes('hard') && !e.difficulty.includes('easy')
        )
        .slice(0, 2)
        .map(e => e.name);

      const result = countExcludedExercises(hardOnlyExercises, 'easy');

      expect(result).toBe(0);
    });

    it('should not count exercises that require unavailable equipment', () => {
      const kettlebellExercises = exercises
        .filter(e => e.equipment?.includes('kettlebell'))
        .map(e => e.name);

      const result = countExcludedExercises(kettlebellExercises, 'medium', []);

      expect(result).toBe(0);
    });

    it('should count exercises that match both difficulty and equipment', () => {
      const matchingExercises = exercises
        .filter(
          e =>
            e.difficulty.includes('medium') &&
            (!e.equipment || e.equipment.every(eq => ['desk'].includes(eq)))
        )
        .slice(0, 2)
        .map(e => e.name);

      const result = countExcludedExercises(matchingExercises, 'medium', [
        'desk',
      ]);

      expect(result).toBeGreaterThan(0);
    });

    it('should ignore non-existent exercise names', () => {
      const fakeExercises = ['Fake Exercise 1', 'Fake Exercise 2'];

      const result = countExcludedExercises(fakeExercises, 'medium');

      expect(result).toBe(0);
    });

    it('should handle mix of valid and invalid exercise names', () => {
      const validName =
        exercises.find(e => e.difficulty.includes('medium'))?.name || '';

      const mixedNames = [validName, 'Fake Exercise'];

      const result = countExcludedExercises(mixedNames, 'medium');

      expect(result).toBe(1);
    });

    it('should handle empty equipment array', () => {
      const bodyweightExercises = exercises
        .filter(e => !e.equipment && e.difficulty.includes('medium'))
        .slice(0, 2)
        .map(e => e.name);

      const result = countExcludedExercises(bodyweightExercises, 'medium', []);

      expect(result).toBe(bodyweightExercises.length);
    });

    it('should handle all difficulty levels', () => {
      const easyExercises = exercises
        .filter(e => e.difficulty.includes('easy'))
        .slice(0, 2)
        .map(e => e.name);

      const easyResult = countExcludedExercises(easyExercises, 'easy');

      expect(easyResult).toBeGreaterThan(0);
    });
  });
});

expect.extend({
  toBeNullOrUndefined(received) {
    const pass = received === null || received === undefined;
    return {
      pass,
      message: () => `expected ${received} to be null or undefined`,
    };
  },
});
