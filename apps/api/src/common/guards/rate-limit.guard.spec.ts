import { describe, expect, it } from 'vitest';
import { RateLimiter } from './rate-limit.guard.js';

describe('RateLimiter', () => {
  const policy = { limit: 2, windowMs: 60_000 };

  it('allows up to the limit, then reports seconds until reset', () => {
    const limiter = new RateLimiter();
    expect(limiter.hit('ip', policy, 0)).toBe(0);
    expect(limiter.hit('ip', policy, 1_000)).toBe(0);
    expect(limiter.hit('ip', policy, 2_000)).toBe(58);
  });

  it('starts a fresh window after it expires and keeps keys separate', () => {
    const limiter = new RateLimiter();
    limiter.hit('a', policy, 0);
    limiter.hit('a', policy, 0);
    expect(limiter.hit('b', policy, 0)).toBe(0);
    expect(limiter.hit('a', policy, 60_000)).toBe(0);
  });
});
