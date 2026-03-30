import { ReleaseYearPipe } from './release-year.pipe';

describe('ReleaseYearPipe', () => {
  let pipe: ReleaseYearPipe;

  beforeEach(() => {
    pipe = new ReleaseYearPipe();
  });

  it('should return null for null', () => {
    expect(pipe.transform(null)).toBeNull();
  });

  it('should return null for undefined', () => {
    expect(pipe.transform(undefined)).toBeNull();
  });

  it('should return null for 0 (falsy timestamp)', () => {
    expect(pipe.transform(0)).toBeNull();
  });

  it('should return the correct year for a valid Unix timestamp', () => {
    // July 14, 2017 02:40:00 UTC — mid-year, safe across all timezones
    const timestamp = 1500000000;
    expect(pipe.transform(timestamp)).toBe(new Date(timestamp * 1000).getFullYear());
  });

  it('should multiply the timestamp by 1000 before converting (seconds not ms)', () => {
    // 978307200 = Jan 1, 2001 00:00:00 UTC
    // Without *1000 this would be ~Jan 12, 1970
    const timestamp = 978307200;
    expect(pipe.transform(timestamp)).toBe(2001);
  });
});
