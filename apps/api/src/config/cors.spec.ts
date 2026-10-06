import { describe, expect, it } from 'vitest';
import { parseCorsOrigins } from './cors.js';

const matches = (origins: Array<string | RegExp>, origin: string) =>
  origins.some((o) => (typeof o === 'string' ? o === origin : o.test(origin)));

describe('parseCorsOrigins', () => {
  it('returns an empty list for empty input', () => {
    expect(parseCorsOrigins(undefined)).toEqual([]);
    expect(parseCorsOrigins(' , ')).toEqual([]);
  });

  it('keeps exact origins and strips trailing slashes', () => {
    expect(parseCorsOrigins('https://brandviserproductions.com/, http://localhost:3000')).toEqual([
      'https://brandviserproductions.com',
      'http://localhost:3000',
    ]);
  });

  it('turns a wildcard into a hostname-safe pattern', () => {
    const origins = parseCorsOrigins('https://brandviserproductions-web-*.vercel.app');
    expect(matches(origins, 'https://brandviserproductions-web-git-feature-x-team.vercel.app')).toBe(true);
    expect(matches(origins, 'https://evil.com/https://brandviserproductions-web-x.vercel.app')).toBe(false);
    expect(matches(origins, 'https://brandviserproductions-web-x.vercel.app.evil.com')).toBe(false);
  });
});
