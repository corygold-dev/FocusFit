import { Exercise, exercises } from '@/src/lib/exercises';
import _ from 'lodash';
import { Difficulty } from './constants';

export type UserSettings = {
  difficulty: Difficulty;
  equipment: string[];
  excludedExercises: string[];
};

export function pickWorkout(userSettings: UserSettings): Exercise[] {
  const { difficulty, equipment, excludedExercises } = userSettings;

  const filteredExercises = _.filter(exercises, (e) => {
    const difficultyMatches = e.difficulty.includes(difficulty);
    const equipmentMatches = !e.equipment || _.every(e.equipment, (eq) => equipment.includes(eq));
    const notExcluded = !excludedExercises.includes(e.name);
    return difficultyMatches && equipmentMatches && notExcluded;
  });

  const nonMobility = _.filter(filteredExercises, (e) => e.category !== 'mobility');

  const [first] = _.sampleSize(nonMobility, 1);

  const [second] = _.sampleSize(
    _.filter(nonMobility, (e) => e.category !== first?.category),
    1,
  );

  const [mobility] = _.sampleSize(
    _.filter(exercises, (e) => e.category === 'mobility' && !excludedExercises.includes(e.name)),
    1,
  );

  return [first, second, mobility].filter(Boolean);
}

export function getFilteredExercisesByCategory(difficulty: Difficulty, equipment: string[] = []) {
  const filteredExercises = _.filter(exercises, (exercise) => {
    const difficultyMatches = exercise.difficulty.includes(difficulty);
    const equipmentMatches =
      !exercise.equipment || _.every(exercise.equipment, (eq) => equipment.includes(eq));
    return difficultyMatches && equipmentMatches;
  });
  return _.groupBy(filteredExercises, 'category');
}

export function countExcludedExercises(
  excludedExercises: string[],
  difficulty: Difficulty,
  equipment: string[] = [],
) {
  const availableExerciseNames = _.chain(exercises)
    .filter((exercise) => {
      const difficultyMatches = exercise.difficulty.includes(difficulty);
      const equipmentMatches =
        !exercise.equipment || _.every(exercise.equipment, (eq) => equipment.includes(eq));
      return difficultyMatches && equipmentMatches;
    })
    .map('name')
    .value();

  return _.filter(excludedExercises, (name) => _.includes(availableExerciseNames, name)).length;
}
