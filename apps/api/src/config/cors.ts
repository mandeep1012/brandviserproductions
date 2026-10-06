import type { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

/**
 * Parses `CORS_ORIGINS` ("https://a.com,https://web-*.vercel.app") into matchers.
 * A single `*` per entry matches one or more URL-safe characters, which covers
 * Vercel preview hostnames without opening the API to every origin.
 */
export function parseCorsOrigins(value: string | undefined): Array<string | RegExp> {
  return (value ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean)
    .map((origin) => {
      if (!origin.includes('*')) return origin;
      const pattern = origin
        .split('*')
        .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
        .join('[a-z0-9-]+');
      return new RegExp(`^${pattern}$`, 'i');
    });
}

/**
 * The browser calls the API directly at NEXT_PUBLIC_API_URL: GETs for gallery paging and
 * POSTs for enquiries and the Blob upload handshake, so JSON POSTs must pass preflight.
 */
export function buildCorsOptions(value: string | undefined): CorsOptions | null {
  const origin = parseCorsOrigins(value);
  if (origin.length === 0) return null;
  return {
    origin,
    methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
    maxAge: 86_400,
  };
}
