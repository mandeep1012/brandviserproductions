import type { Prisma } from '../../generated/prisma/client.js';
import type { ListCaseStudiesQuery } from './dto/list-case-studies.query.js';

type Filters = Pick<ListCaseStudiesQuery, 'type' | 'service' | 'city' | 'year' | 'featured'>;

/** Translates gallery filters into a Prisma `where`. Only published case studies are visible. */
export function buildCaseStudyWhere(filters: Filters): Prisma.CaseStudyWhereInput {
  const where: Prisma.CaseStudyWhereInput = { isPublished: true };
  if (filters.type) where.eventType = filters.type;
  if (filters.featured !== undefined) where.isFeatured = filters.featured;
  if (filters.city) where.city = { equals: filters.city, mode: 'insensitive' };
  if (filters.service) where.services = { some: { slug: filters.service, isPublished: true } };
  if (filters.year) {
    where.eventDate = {
      gte: new Date(Date.UTC(filters.year, 0, 1)),
      lt: new Date(Date.UTC(filters.year + 1, 0, 1)),
    };
  }
  return where;
}

/** Newest first, with the editor's sort order and id as tie-breakers. */
export const caseStudyOrder: Prisma.CaseStudyOrderByWithRelationInput[] = [
  { eventDate: 'desc' },
  { sortOrder: 'asc' },
  { id: 'asc' },
];
