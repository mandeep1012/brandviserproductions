import type { CaseStudyDetail, CaseStudySummary } from '@brandviserproductions/contracts';
import type { CaseStudy, Service, Testimonial } from '../../generated/prisma/client.js';
import { toTestimonial } from '../testimonials/testimonials.mapper.js';

type WithServices = CaseStudy & { services: Pick<Service, 'slug' | 'shortName' | 'sortOrder'>[] };
type WithRelations = WithServices & { testimonials: Testimonial[] };

/** Prisma include shared by the list and detail queries. */
export const serviceTagSelect = {
  where: { isPublished: true },
  select: { slug: true, shortName: true, sortOrder: true },
  orderBy: { sortOrder: 'asc' as const },
};

export function toCaseStudySummary(row: WithServices): CaseStudySummary {
  return {
    id: row.id,
    slug: row.slug,
    client: row.client,
    title: row.title,
    eventType: row.eventType,
    city: row.city,
    year: row.eventDate.getUTCFullYear(),
    coverImageUrl: row.coverImageUrl,
    services: row.services.map(({ slug, shortName }) => ({ slug, shortName })),
    isFeatured: row.isFeatured,
  };
}

export function toCaseStudyDetail(row: WithRelations): CaseStudyDetail {
  const testimonial = row.testimonials.find((t) => t.isPublished) ?? null;
  return {
    ...toCaseStudySummary(row),
    summary: row.summary,
    body: row.body,
    eventDate: row.eventDate.toISOString().slice(0, 10),
    gallery: row.gallery,
    attendees: row.attendees,
    citiesCount: row.citiesCount,
    days: row.days,
    testimonial: testimonial ? toTestimonial(testimonial) : null,
  };
}
