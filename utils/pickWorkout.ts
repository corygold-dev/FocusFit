import _ from 'lodash';
import { Exercise, exercises } from '../app/lib/exercises';

export function pickWorkout(): Exercise[] {
  const nonMobility = _.filter(exercises, (e) => e.category !== 'mobility');

  const [first] = _.sampleSize(nonMobility, 1);

  const [second] = _.sampleSize(
    _.filter(nonMobility, (e) => e.category !== first.category),
    1,
  );

  const [mobility] = _.sampleSize(
    _.filter(exercises, (e) => e.category === 'mobility'),
    1,
  );

  return [first, second, mobility];
}
