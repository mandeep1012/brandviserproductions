import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/config';

export default function robots(): MetadataRoute.Robots {
  // Only production is indexable; previews are kept out of search results.
  const production = process.env.VERCEL_ENV === 'production';
  return {
    rules: production ? { userAgent: '*', allow: '/', disallow: '/api/' } : { userAgent: '*', disallow: '/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
