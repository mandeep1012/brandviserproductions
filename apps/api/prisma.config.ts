import 'dotenv/config';
import { defineConfig } from 'prisma/config';

/**
 * Prisma Migrate needs a direct connection (poolers break advisory locks), so prefer the
 * unpooled URL. The runtime client uses DATABASE_URL through the pg driver adapter.
 * `process.env` is read directly (not `env()`), so `prisma generate` still works on
 * `npm install` and in CI when no database is configured.
 */
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? '',
  },
});
