import type { MetadataRoute } from 'next';
import { api, optional } from '@/lib/api/server';
import { SITE_URL } from '@/lib/config';

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = (await optional(api.caseStudySlugs())) ?? [];
  const pages = ['', '/expertise', '/gallery', '/moments', '/contact'].map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));
  const caseStudies = slugs.map((slug) => ({
    url: `${SITE_URL}/gallery/${slug}`,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));
  return [...pages, ...caseStudies];
}
