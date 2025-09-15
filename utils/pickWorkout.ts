import _ from 'lodash';
import { Exercise, exercises } from '../app/lib/exercises';

export function pickWorkout(): Exercise[] {
  const nonStretch = _.filter(exercises, (e) => e.category !== 'stretch');

  const [first] = _.sampleSize(nonStretch, 1);

  const [second] = _.sampleSize(
    _.filter(nonStretch, (e) => e.category !== first.category),
    1,
  );

  const [stretch] = _.sampleSize(
    _.filter(exercises, (e) => e.category === 'stretch'),
    1,
  );

  return [first, second, stretch];
}
