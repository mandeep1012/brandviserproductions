import { Injectable, Logger, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { attachDatabasePool } from '@vercel/functions';
import { Pool } from 'pg';
import type { Env } from '../config/env.validation.js';
import type { PoolStats } from '../modules/health/health.types.js';
import { PrismaClient } from '../generated/prisma/client.js';
import { withExplicitSslMode } from './connection-string.js';

const POOL_MAX = 5;

/**
 * One Prisma client per function instance. With Fluid compute an instance serves many
 * concurrent requests, so a small pg pool is shared across them; `attachDatabasePool`
 * lets Vercel close idle connections before the instance is suspended.
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  private readonly pool: Pool;

  constructor(config: ConfigService<Env, true>) {
    const pool = new Pool({
      connectionString: withExplicitSslMode(config.get('DATABASE_URL', { infer: true })),
      max: POOL_MAX,
      idleTimeoutMillis: 5_000,
    });
    attachDatabasePool(pool);
    super({ adapter: new PrismaPg(pool) });
    this.pool = pool;
  }

  /** Connection counts for this instance's pool (reported by the health check). */
  poolStats(): PoolStats {
    return {
      max: POOL_MAX,
      total: this.pool.totalCount,
      idle: this.pool.idleCount,
      waiting: this.pool.waitingCount,
    };
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
    await this.pool.end().catch((error: unknown) => this.logger.warn(`Pool shutdown failed: ${String(error)}`));
  }
}
