import type { CaseStudyQuery, FaqPage } from '@brandviserproductions/contracts';

/** Paths under /api/v1, shared by the server fetcher and the browser client. */
export const endpoints = {
  site: () => '/site',
  services: () => '/services',
  serviceMatrix: () => '/services/matrix',
  processSteps: () => '/process-steps',
  caseStudies: (query: CaseStudyQuery = {}) => `/case-studies${toSearch(query)}`,
  caseStudyFacets: () => '/case-studies/facets',
  caseStudySlugs: () => '/case-studies/slugs',
  caseStudy: (slug: string) => `/case-studies/${encodeURIComponent(slug)}`,
  testimonials: (query: { featured?: boolean; limit?: number } = {}) => `/testimonials${toSearch(query)}`,
  team: () => '/team',
  faqs: (page: FaqPage) => `/faqs?page=${page.toLowerCase()}`,
  enquiries: () => '/enquiries',
  quickEnquiries: () => '/enquiries/quick',
  briefUpload: () => '/uploads/brief',
} as const;

export function toSearch(params: object): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') search.set(key, String(value));
  }
  const query = search.toString();
  return query ? `?${query}` : '';
}
