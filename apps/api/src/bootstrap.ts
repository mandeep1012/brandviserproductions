import { VersioningType, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { buildCorsOptions } from './config/cors.js';
import { securityHeaders } from './config/security-headers.js';
import type { Env } from './config/env.validation.js';
import { createValidationPipe } from './common/validation.js';

/**
 * Applies every cross-cutting concern. Shared by `main.ts` (local + Vercel) and e2e tests,
 * so the app under test is configured exactly like production.
 */
export function configureApp(app: NestExpressApplication): INestApplication {
  const config = app.get<ConfigService<Env, true>>(ConfigService);

  app.set('trust proxy', true); // Vercel terminates TLS and forwards client IPs.
  app.use(...securityHeaders);
  app.setGlobalPrefix('api');
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(createValidationPipe());

  const cors = buildCorsOptions(config.get('CORS_ORIGINS', { infer: true }));
  if (cors) app.enableCors(cors);

  app.enableShutdownHooks();
  return app;
}
