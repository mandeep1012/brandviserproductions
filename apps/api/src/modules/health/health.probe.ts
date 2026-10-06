import type { OverallStatus, Probe } from './health.types.js';

export class ProbeTimeoutError extends Error {
  constructor(timeoutMs: number) {
    super(`Probe timed out after ${timeoutMs}ms`);
  }
}

/** Runs one check with a deadline and times it. Never rejects; failures are passed to `onError`. */
export async function probe<T extends object>(
  run: () => Promise<T>,
  timeoutMs: number,
  onError: (error: unknown) => void = () => {},
): Promise<Probe<T>> {
  const started = performance.now();
  const elapsed = () => Math.round(performance.now() - started);
  let timer: NodeJS.Timeout | undefined;
  const deadline = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ProbeTimeoutError(timeoutMs)), timeoutMs);
  });
  try {
    const data = await Promise.race([run(), deadline]);
    return { status: 'up', latencyMs: elapsed(), ...data };
  } catch (error) {
    onError(error);
    return { status: 'down', latencyMs: elapsed(), error: error instanceof ProbeTimeoutError ? 'timeout' : 'failed' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * The database is required: without it every content route fails, so the API is `down`.
 * Any other failing check (or a failed migration) leaves it serving but `degraded`.
 */
export function overallStatus(database: Probe<object>, others: Array<Probe<object>>, failedMigrations = 0): OverallStatus {
  if (database.status === 'down') return 'down';
  if (failedMigrations > 0 || others.some((check) => check.status === 'down')) return 'degraded';
  return 'ok';
}
