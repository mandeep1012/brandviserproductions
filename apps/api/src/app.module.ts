import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { PrismaExceptionFilter } from './common/filters/prisma-exception.filter.js';
import { CacheControlInterceptor } from './common/interceptors/cache-control.interceptor.js';
import { validateEnv } from './config/env.validation.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { CaseStudiesModule } from './modules/case-studies/case-studies.module.js';
import { EnquiriesModule } from './modules/enquiries/enquiries.module.js';
import { FaqsModule } from './modules/faqs/faqs.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { NotificationsModule } from './modules/notifications/notifications.module.js';
import { ProcessModule } from './modules/process/process.module.js';
import { RevalidationModule } from './modules/revalidation/revalidation.module.js';
import { ServicesModule } from './modules/services/services.module.js';
import { SiteModule } from './modules/site/site.module.js';
import { TeamModule } from './modules/team/team.module.js';
import { TestimonialsModule } from './modules/testimonials/testimonials.module.js';
import { UploadsModule } from './modules/uploads/uploads.module.js';
import { PrismaModule } from './prisma/prisma.module.js';

@Module({
  imports: [
    // On Vercel, env vars are injected into process.env; .env is only for local development.
    ConfigModule.forRoot({ isGlobal: true, cache: true, validate: validateEnv }),
    // Limits are set per controller with @Throttle; only the guarded write routes use them.
    ThrottlerModule.forRoot([{ name: 'default', ttl: 60_000, limit: 60 }]),
    PrismaModule,
    NotificationsModule,
    RevalidationModule,
    SiteModule,
    ServicesModule,
    ProcessModule,
    CaseStudiesModule,
    TestimonialsModule,
    TeamModule,
    FaqsModule,
    EnquiriesModule,
    UploadsModule,
    AdminModule,
    HealthModule,
  ],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: CacheControlInterceptor },
    { provide: APP_FILTER, useClass: PrismaExceptionFilter },
  ],
})
export class AppModule {}
