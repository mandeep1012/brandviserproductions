// Runs `prisma migrate deploy` during the Vercel build, but only where it is safe:
//   - production deployments, always;
//   - preview deployments only when MIGRATE_PREVIEWS=1, i.e. when each preview has its own
//     database branch (Neon's Vercel integration can create one per preview). Without that,
//     a preview would apply unmerged migrations to the production database.
import { execSync } from 'node:child_process';

const env = process.env.VERCEL_ENV ?? 'development';
const allowed = env === 'production' || (env === 'preview' && process.env.MIGRATE_PREVIEWS === '1');

if (!allowed) {
  console.log(`[migrate] Skipping prisma migrate deploy for VERCEL_ENV=${env}.`);
} else if (!process.env.DATABASE_URL_UNPOOLED && !process.env.DATABASE_URL) {
  console.error('[migrate] No DATABASE_URL_UNPOOLED or DATABASE_URL; cannot migrate.');
  process.exit(1);
} else {
  execSync('prisma migrate deploy', { stdio: 'inherit' });
}
