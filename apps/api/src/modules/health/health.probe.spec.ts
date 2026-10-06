import { describe, expect, it, vi } from 'vitest';
import { overallStatus, probe } from './health.probe.js';

const up = { status: 'up', latencyMs: 1 } as const;
const down = { status: 'down', latencyMs: 1, error: 'failed' } as const;

describe('probe', () => {
  it('returns the check data with status up', async () => {
    const result = await probe(async () => ({ count: 3 }), 1_000);
    expect(result).toMatchObject({ status: 'up', count: 3 });
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
  });

  it('reports a rejected check as failed without leaking the error', async () => {
    const onError = vi.fn();
    const result = await probe(() => Promise.reject(new Error('host db.internal unreachable')), 1_000, onError);
    expect(result).toEqual({ status: 'down', latencyMs: expect.any(Number), error: 'failed' });
    expect(onError).toHaveBeenCalledOnce();
  });

  it('reports a slow check as a timeout', async () => {
    const result = await probe(() => new Promise<object>(() => {}), 10);
    expect(result).toMatchObject({ status: 'down', error: 'timeout' });
  });
});

describe('overallStatus', () => {
  it('is ok when every check is up', () => {
    expect(overallStatus(up, [up, up])).toBe('ok');
  });

  it('is down when the database is down', () => {
    expect(overallStatus(down, [up, up])).toBe('down');
  });

  it('is degraded when a secondary check fails or a migration failed', () => {
    expect(overallStatus(up, [up, down])).toBe('degraded');
    expect(overallStatus(up, [up, up], 1)).toBe('degraded');
  });
});
