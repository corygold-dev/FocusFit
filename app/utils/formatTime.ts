import _ from 'lodash';

export function formatTime(seconds: number) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${_.padStart(secs.toString(), 2, '0')}`;
}
