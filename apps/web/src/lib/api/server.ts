import 'server-only';
import { notFound } from 'next/navigation';
import type {
  CaseStudyDetail,
  CaseStudyFacets,
  CaseStudyQuery,
  CaseStudySummary,
  Faq,
  FaqPage,
  Paginated,
  ProcessStep,
  Service,
  ServiceMatrix,
  SiteInfo,
  TeamMember,
  Testimonial,
} from '@brandviserproductions/contracts';
import { API_BASE, REVALIDATE_SECONDS } from '../config';
import { endpoints } from './endpoints';
import { toApiError } from './errors';

/** Cache tags. The API's admin writes revalidate these through /api/revalidate. */
export type ContentTag = 'site' | 'services' | 'process' | 'case-studies' | 'testimonials' | 'team' | 'faqs';

/**
 * Server Component fetch: cached in the Next data cache for the ISR window and tagged so
 * content edits can invalidate it immediately.
 */
async function serverFetch<T>(path: string, tags: ContentTag[]): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { accept: 'application/json' },
    next: { revalidate: REVALIDATE_SECONDS, tags },
  });
  if (!res.ok) throw await toApiError(res);
  return (await res.json()) as T;
}

/**
 * For sections a page can live without (logos, testimonials, team): a failure hides the
 * section instead of failing the whole page. The error is logged on the server.
 */
export async function optional<T>(promise: Promise<T>): Promise<T | null> {
  try {
    return await promise;
  } catch (error) {
    console.error('[api] optional section failed:', error);
    return null;
  }
}

export const api = {
  site: () => serverFetch<SiteInfo>(endpoints.site(), ['site']),
  services: () => serverFetch<Service[]>(endpoints.services(), ['services']),
  serviceMatrix: () => serverFetch<ServiceMatrix>(endpoints.serviceMatrix(), ['services']),
  processSteps: () => serverFetch<ProcessStep[]>(endpoints.processSteps(), ['process']),
  caseStudies: (query: CaseStudyQuery = {}) =>
    serverFetch<Paginated<CaseStudySummary>>(endpoints.caseStudies(query), ['case-studies']),
  caseStudyFacets: () => serverFetch<CaseStudyFacets>(endpoints.caseStudyFacets(), ['case-studies']),
  caseStudySlugs: () => serverFetch<string[]>(endpoints.caseStudySlugs(), ['case-studies']),
  /** 404 from the API becomes the Next.js not-found page. */
  caseStudy: async (slug: string) => {
    try {
      return await serverFetch<CaseStudyDetail>(endpoints.caseStudy(slug), ['case-studies']);
    } catch (error) {
      if (error instanceof Error && 'status' in error && (error.status === 404 || error.status === 400)) notFound();
      throw error;
    }
  },
  testimonials: (query: { featured?: boolean; limit?: number } = {}) =>
    serverFetch<Testimonial[]>(endpoints.testimonials(query), ['testimonials']),
  team: () => serverFetch<TeamMember[]>(endpoints.team(), ['team']),
  faqs: (page: FaqPage) => serverFetch<Faq[]>(endpoints.faqs(page), ['faqs']),
};
