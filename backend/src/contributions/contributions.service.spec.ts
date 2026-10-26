import { dayNumber } from './contributions.service';

describe('dayNumber (streak calendar days, IST)', () => {
  it('treats 23:00 and 01:00 next day as consecutive days', () => {
    const lateNight = new Date('2026-10-20T23:00:00+05:30');
    const earlyMorning = new Date('2026-10-21T01:00:00+05:30');
    expect(dayNumber(earlyMorning) - dayNumber(lateNight)).toBe(1);
  });

  it('treats 00:30 and 23:30 on the same date as the same day', () => {
    expect(dayNumber(new Date('2026-10-21T00:30:00+05:30'))).toBe(dayNumber(new Date('2026-10-21T23:30:00+05:30')));
  });
});
