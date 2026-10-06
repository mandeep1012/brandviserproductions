import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module.js';
import { configureApp } from './bootstrap.js';

/**
 * Entrypoint for both local development and Vercel.
 *
 * Vercel detects NestJS by finding `src/main.ts` importing `@nestjs/core` directly (keep the
 * NestFactory call here, not behind a helper), then runs this server as a single Vercel
 * Function on Fluid compute, serving every /api/v1/* route. It needs the conventional
 * `bootstrap()` that calls `app.listen(process.env.PORT)`. Do not export a custom handler or
 * add `builds`/`routes` to vercel.json: that older workaround bypasses framework detection.
 */
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: true });
  configureApp(app);
  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  Logger.log(`API listening on http://localhost:${port}/api/v1`, 'Bootstrap');
}

void bootstrap();
