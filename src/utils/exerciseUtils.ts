import { Exercise, exercises } from '@/src/lib/exercises';
import _ from 'lodash';
import { Difficulty } from './constants';

export type UserSettings = {
  difficulty: Difficulty;
  equipment: string[];
  excludedExercises: string[];
  theme?: string;
  morningReminders?: boolean;
  afternoonReminders?: boolean;
  timerEndNotifications?: boolean;
};

export function pickStrengthWorkout(userSettings: UserSettings): Exercise[] {
  const { difficulty, equipment, excludedExercises } = userSettings;

  const filteredExercises = _.filter(exercises, (e) => {
    const difficultyMatches = e.difficulty.includes(difficulty);
    const equipmentMatches = !e.equipment || _.every(e.equipment, (eq) => equipment.includes(eq));
    const notExcluded = !excludedExercises.includes(e.name);
    const isStrength = e.category !== 'mobility';
    return difficultyMatches && equipmentMatches && notExcluded && isStrength;
  });

  const upperBodyExercises = _.filter(filteredExercises, (e) => e.category === 'upper');
  const lowerBodyExercises = _.filter(filteredExercises, (e) => e.category === 'lower');

  const [upperExercise] = _.sampleSize(upperBodyExercises, 1);
  const [lowerExercise] = _.sampleSize(lowerBodyExercises, 1);

  return [upperExercise, lowerExercise].filter(Boolean);
}

export function pickMobilityWorkout(userSettings: UserSettings): Exercise[] {
  const { difficulty, equipment, excludedExercises } = userSettings;

  const filteredExercises = _.filter(exercises, (e) => {
    const difficultyMatches = e.difficulty.includes(difficulty);
    const equipmentMatches = !e.equipment || _.every(e.equipment, (eq) => equipment.includes(eq));
    const notExcluded = !excludedExercises.includes(e.name);
    const isMobility = e.category === 'mobility';
    return difficultyMatches && equipmentMatches && notExcluded && isMobility;
  });

  const [first] = _.sampleSize(filteredExercises, 1);
  const [second] = _.sampleSize(
    _.filter(filteredExercises, (e) => e.name !== first?.name),
    1,
  );

  return [first, second].filter(Boolean);
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
