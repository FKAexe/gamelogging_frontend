import { CoverUrlPipe } from './cover-url.pipe';

describe('CoverUrlPipe', () => {
  let pipe: CoverUrlPipe;

  beforeEach(() => {
    pipe = new CoverUrlPipe();
  });

  it('should return empty string for null', () => {
    expect(pipe.transform(null)).toBe('');
  });

  it('should return empty string for undefined', () => {
    expect(pipe.transform(undefined)).toBe('');
  });

  it('should return empty string for empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should prepend https: to protocol-relative URLs', () => {
    expect(pipe.transform('//images.igdb.com/igdb/image/upload/t_cover_big/abc.jpg'))
      .toBe('https://images.igdb.com/igdb/image/upload/t_cover_big/abc.jpg');
  });

  it('should pass through already-absolute https URLs unchanged', () => {
    const url = 'https://images.igdb.com/igdb/image/upload/t_cover_big/abc.jpg';
    expect(pipe.transform(url)).toBe(url);
  });

  it('should pass through http URLs unchanged', () => {
    const url = 'http://images.igdb.com/igdb/image/upload/t_cover_big/abc.jpg';
    expect(pipe.transform(url)).toBe(url);
  });
});
