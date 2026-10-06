import {
  HttpException,
  HttpStatus,
  Injectable,
  SetMetadata,
  type CanActivate,
  type ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';

export interface RateLimitPolicy {
  /** Requests allowed per window. */
  limit: number;
  /** Window length in milliseconds. */
  windowMs: number;
}

export const RATE_LIMIT_KEY = 'bvp:rate-limit';

/** Limits requests per client IP for a controller or handler. Use with `@UseGuards(RateLimitGuard)`. */
export const RateLimit = (policy: RateLimitPolicy) => SetMetadata(RATE_LIMIT_KEY, policy);

/**
 * Fixed-window counter per (route, IP), kept in memory. On Vercel each function instance has its
 * own counters, so this is a first line of defence; pair it with a Vercel Firewall rate-limit rule.
 * (@nestjs/throttler is not used: it is CommonJS and Vercel's loader cannot require() Nest 12's ESM.)
 */
export class RateLimiter {
  private readonly hits = new Map<string, { count: number; resetAt: number }>();

  /** Returns 0 when allowed, otherwise the seconds until the window resets. */
  hit(key: string, policy: RateLimitPolicy, now = Date.now()): number {
    if (this.hits.size > 10_000) this.sweep(now);
    const entry = this.hits.get(key);
    if (!entry || entry.resetAt <= now) {
      this.hits.set(key, { count: 1, resetAt: now + policy.windowMs });
      return 0;
    }
    entry.count += 1;
    return entry.count > policy.limit ? Math.ceil((entry.resetAt - now) / 1000) : 0;
  }

  private sweep(now: number): void {
    for (const [key, entry] of this.hits) if (entry.resetAt <= now) this.hits.delete(key);
  }
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private static readonly limiter = new RateLimiter();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const policy = this.reflector.getAllAndOverride<RateLimitPolicy | undefined>(RATE_LIMIT_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!policy) return true;
    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const key = `${context.getClass().name}.${context.getHandler().name}:${request.ip ?? 'unknown'}`;
    const retryAfter = RateLimitGuard.limiter.hit(key, policy);
    if (retryAfter === 0) return true;
    http.getResponse<Response>().setHeader('Retry-After', String(retryAfter));
    throw new HttpException(
      { statusCode: 429, error: 'Too Many Requests', message: 'Too many requests. Please try again shortly.' },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
