import { describe, expect, it } from 'vitest';
import { tokenMatches } from './admin-token.guard.js';

describe('tokenMatches', () => {
  it('accepts the configured bearer token', () => {
    expect(tokenMatches('s3cret', 'Bearer s3cret')).toBe(true);
  });

  it('rejects a wrong, missing or malformed header', () => {
    expect(tokenMatches('s3cret', 'Bearer nope')).toBe(false);
    expect(tokenMatches('s3cret', undefined)).toBe(false);
    expect(tokenMatches('s3cret', 's3cret')).toBe(false);
  });

  it('rejects everything when no token is configured', () => {
    expect(tokenMatches(undefined, 'Bearer ')).toBe(false);
    expect(tokenMatches('', 'Bearer ')).toBe(false);
  });
});
