import { Injectable, type CallHandler, type ExecutionContext, type NestInterceptor } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request, Response } from 'express';
import { tap, type Observable } from 'rxjs';
import { CACHE_POLICY_KEY, formatCachePolicy, type CachePolicy } from '../decorators/cache-control.decorator.js';

/**
 * Sets `Cache-Control` only on successful GETs, so errors (404/500) are never cached at
 * the edge. Handler-level metadata overrides controller-level metadata.
 */
@Injectable()
export class CacheControlInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const policy = this.reflector.getAllAndOverride<CachePolicy | 'no-store' | undefined>(CACHE_POLICY_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const http = context.switchToHttp();
    if (!policy || context.getType() !== 'http' || http.getRequest<Request>().method !== 'GET') {
      return next.handle();
    }
    return next.handle().pipe(tap(() => http.getResponse<Response>().setHeader('Cache-Control', formatCachePolicy(policy))));
  }
}
