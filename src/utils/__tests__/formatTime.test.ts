import { formatTime } from '../formatTime';

describe('formatTime', () => {
  it('formats seconds correctly for minutes and seconds', () => {
    expect(formatTime(0)).toBe('0:00');
    expect(formatTime(30)).toBe('0:30');
    expect(formatTime(60)).toBe('1:00');
    expect(formatTime(90)).toBe('1:30');
    expect(formatTime(125)).toBe('2:05');
  });

  it('formats seconds correctly for hours, minutes and seconds', () => {
    expect(formatTime(3600)).toBe('1:00:00');
    expect(formatTime(3661)).toBe('1:01:01');
    expect(formatTime(7325)).toBe('2:02:05');
  });

  it('handles edge cases', () => {
    expect(formatTime(59)).toBe('0:59');
    expect(formatTime(3599)).toBe('59:59');
    expect(formatTime(3601)).toBe('1:00:01');
  });
});
