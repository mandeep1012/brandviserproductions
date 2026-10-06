import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { overallStatus, probe } from './health.probe.js';
import type { ContentCounts, HealthReport, MigrationState } from './health.types.js';

const PROBE_TIMEOUT_MS = 3_000;
const toMb = (bytes: number) => Math.round(bytes / 1024 / 1024);

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(private readonly prisma: PrismaService) {}

  async report(): Promise<HealthReport> {
    const started = performance.now();
    const run = <T extends object>(name: string, check: () => Promise<T>) =>
      probe(check, PROBE_TIMEOUT_MS, (error) => this.logger.error(`${name} check failed: ${String(error)}`));

    const [ping, migrations, content] = await Promise.all([
      run('database', () => this.prisma.$queryRaw`SELECT 1`.then(() => ({}))),
      run('migrations', () => this.migrationState()),
      run('content', () => this.contentCounts()),
    ]);
    // Pool stats are read after the probes so they reflect the connections those just used.
    const database = ping.status === 'up' ? { ...ping, pool: this.prisma.poolStats() } : ping;
    const failedMigrations = migrations.status === 'up' ? migrations.failed : 0;
    const memory = process.memoryUsage();

    return {
      status: overallStatus(database, [migrations, content], failedMigrations),
      timestamp: new Date().toISOString(),
      responseTimeMs: Math.round(performance.now() - started),
      deployment: {
        environment: process.env.VERCEL_ENV ?? process.env.NODE_ENV ?? 'development',
        region: process.env.VERCEL_REGION ?? 'local',
        deploymentId: process.env.VERCEL_DEPLOYMENT_ID ?? null,
        commit: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? null,
      },
      instance: {
        node: process.version,
        uptimeSeconds: Math.round(process.uptime()),
        memoryMb: { rss: toMb(memory.rss), heapUsed: toMb(memory.heapUsed), heapTotal: toMb(memory.heapTotal) },
      },
      checks: { database, migrations, content },
    };
  }

  /** Applied/failed rows in Prisma's migration table. A failed row blocks `migrate deploy`. */
  private async migrationState(): Promise<MigrationState> {
    const [row] = await this.prisma.$queryRaw<Array<{ applied: bigint; failed: bigint; latest: string | null }>>`
      SELECT
        count(*) FILTER (WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL) AS applied,
        count(*) FILTER (WHERE finished_at IS NULL AND rolled_back_at IS NULL) AS failed,
        (SELECT migration_name FROM _prisma_migrations
          WHERE finished_at IS NOT NULL AND rolled_back_at IS NULL
          ORDER BY finished_at DESC LIMIT 1) AS latest
      FROM _prisma_migrations`;
    return { applied: Number(row?.applied ?? 0), failed: Number(row?.failed ?? 0), latest: row?.latest ?? null };
  }

  /** Row counts on one connection, so an empty table (e.g. a missed seed) shows up as 0. */
  private async contentCounts(): Promise<ContentCounts> {
    const [services, caseStudies, testimonials, enquiries] = await this.prisma.$transaction([
      this.prisma.service.count(),
      this.prisma.caseStudy.count(),
      this.prisma.testimonial.count(),
      this.prisma.enquiry.count(),
    ]);
    return { services, caseStudies, testimonials, enquiries };
  }
}
