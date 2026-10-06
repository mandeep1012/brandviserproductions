export type CheckStatus = 'up' | 'down';
export type OverallStatus = 'ok' | 'degraded' | 'down';

/** A probe either reports its data or why it failed. Error details stay in the logs. */
export type Probe<T extends object> =
  | ({ status: 'up'; latencyMs: number } & T)
  | { status: 'down'; latencyMs: number; error: 'timeout' | 'failed' };

export interface PoolStats {
  max: number;
  total: number;
  idle: number;
  waiting: number;
}

export interface MigrationState {
  applied: number;
  failed: number;
  latest: string | null;
}

export interface ContentCounts {
  services: number;
  caseStudies: number;
  testimonials: number;
  enquiries: number;
}

export interface HealthReport {
  status: OverallStatus;
  timestamp: string;
  responseTimeMs: number;
  deployment: {
    environment: string;
    region: string;
    deploymentId: string | null;
    commit: string | null;
  };
  instance: {
    node: string;
    uptimeSeconds: number;
    memoryMb: { rss: number; heapUsed: number; heapTotal: number };
  };
  checks: {
    database: Probe<{ pool: PoolStats }>;
    migrations: Probe<MigrationState>;
    content: Probe<ContentCounts>;
  };
}
