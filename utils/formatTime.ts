import _ from 'lodash';

export function formatTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}:${_.padStart(mins.toString(), 2, '0')}:${_.padStart(secs.toString(), 2, '0')}`;
  }

  return `${mins}:${_.padStart(secs.toString(), 2, '0')}`;
}
