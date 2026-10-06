import type { CaseStudyQuery, EventType } from '@brandviserproductions/contracts';
import { EVENT_TYPES } from './labels';

/** Gallery filters as they appear in the URL: /gallery?type=product-launch&city=Pune&year=2025&page=2 */
export interface GalleryFilters {
  type?: EventType;
  service?: string;
  city?: string;
  year?: number;
}

export const PAGE_SIZE = 12;

const typeToSlug = (type: EventType) => type.toLowerCase().replace(/_/g, '-');
const slugToType = (slug: string) => EVENT_TYPES.find((t) => typeToSlug(t) === slug);

type SearchParams = Record<string, string | string[] | undefined>;
const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

/** Reads filters from search params, silently dropping anything malformed. */
export function parseGalleryParams(params: SearchParams): { filters: GalleryFilters; page: number } {
  const type = slugToType(first(params.type) ?? '');
  const service = first(params.service);
  const city = first(params.city)?.trim();
  const year = Number(first(params.year));
  const page = Number(first(params.page));
  return {
    filters: {
      ...(type ? { type } : {}),
      ...(service && /^[a-z0-9-]{1,80}$/.test(service) ? { service } : {}),
      ...(city && city.length <= 80 ? { city } : {}),
      ...(Number.isInteger(year) && year >= 2000 && year <= 2100 ? { year } : {}),
    },
    page: Number.isInteger(page) && page >= 1 && page <= 1000 ? page : 1,
  };
}

/** Builds a gallery URL. Changing a filter resets to page 1. */
export function galleryHref(filters: GalleryFilters, page = 1): string {
  const search = new URLSearchParams();
  if (filters.type) search.set('type', typeToSlug(filters.type));
  if (filters.service) search.set('service', filters.service);
  if (filters.city) search.set('city', filters.city);
  if (filters.year) search.set('year', String(filters.year));
  if (page > 1) search.set('page', String(page));
  const query = search.toString();
  return query ? `/gallery?${query}` : '/gallery';
}

export const hasFilters = (filters: GalleryFilters) => Object.keys(filters).length > 0;

export const toApiQuery = (filters: GalleryFilters, page: number): CaseStudyQuery => ({
  ...filters,
  page,
  limit: PAGE_SIZE,
});
