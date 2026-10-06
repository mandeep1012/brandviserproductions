import { createHash, timingSafeEqual } from 'node:crypto';
import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import type { Env } from '../../config/env.validation.js';

const digest = (value: string) => createHash('sha256').update(value).digest();

/** Compares in constant time; hashing first makes both buffers the same length. */
export function tokenMatches(expected: string | undefined, header: string | undefined): boolean {
  if (!expected || !header?.startsWith('Bearer ')) return false;
  return timingSafeEqual(digest(expected), digest(header.slice('Bearer '.length)));
}

/** Protects /admin/*. With ADMIN_API_TOKEN unset every request is rejected. */
@Injectable()
export class AdminTokenGuard implements CanActivate {
  constructor(private readonly config: ConfigService<Env, true>) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    if (!tokenMatches(this.config.get('ADMIN_API_TOKEN', { infer: true }), request.headers.authorization)) {
      throw new UnauthorizedException('A valid admin token is required');
    }
    return true;
  }
}
