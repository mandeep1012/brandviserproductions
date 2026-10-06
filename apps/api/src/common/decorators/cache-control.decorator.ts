import { SetMetadata } from '@nestjs/common';

export interface CachePolicy {
  /** Seconds the Vercel CDN may serve the response without revalidating. */
  sMaxAge: number;
  /** Seconds the CDN may serve stale content while it revalidates in the background. */
  staleWhileRevalidate?: number;
}

export const CACHE_POLICY_KEY = 'bvp:cache-policy';

/** Public, read-mostly marketing content: 5 min fresh at the edge, 1 day stale-while-revalidate. */
export const CONTENT_CACHE: CachePolicy = { sMaxAge: 300, staleWhileRevalidate: 86_400 };

/** Applies a `Cache-Control` header to successful GET responses. Use `'no-store'` to opt out. */
export const CacheControl = (policy: CachePolicy | 'no-store') => SetMetadata(CACHE_POLICY_KEY, policy);

export function formatCachePolicy(policy: CachePolicy | 'no-store'): string {
  if (policy === 'no-store') return 'no-store';
  const directives = ['public', 'max-age=0', `s-maxage=${policy.sMaxAge}`];
  if (policy.staleWhileRevalidate) directives.push(`stale-while-revalidate=${policy.staleWhileRevalidate}`);
  return directives.join(', ');
}
