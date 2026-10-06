import { Injectable } from '@nestjs/common';
import type { CaseStudyDetail, CaseStudyFacets, CaseStudySummary, Paginated } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { EVENT_TYPE_LABELS, EVENT_TYPES } from '../../common/labels.js';
import { orNotFound, pageWindow, toPage } from '../../common/utils/paginate.js';
import { buildCaseStudyWhere, caseStudyOrder } from './case-studies.filters.js';
import { serviceTagSelect, toCaseStudyDetail, toCaseStudySummary } from './case-studies.mapper.js';
import type { ListCaseStudiesQuery } from './dto/list-case-studies.query.js';

@Injectable()
export class CaseStudiesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListCaseStudiesQuery): Promise<Paginated<CaseStudySummary>> {
    const where = buildCaseStudyWhere(query);
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.caseStudy.findMany({
        where,
        orderBy: caseStudyOrder,
        include: { services: serviceTagSelect },
        ...pageWindow(query),
      }),
      this.prisma.caseStudy.count({ where }),
    ]);
    return toPage(rows.map(toCaseStudySummary), total, query);
  }

  async bySlug(slug: string): Promise<CaseStudyDetail> {
    const row = await this.prisma.caseStudy.findFirst({
      where: { slug, isPublished: true },
      include: { services: serviceTagSelect, testimonials: { orderBy: { sortOrder: 'asc' } } },
    });
    return toCaseStudyDetail(orNotFound(row, 'Case study', slug));
  }

  /** Header counts and the options offered by the City / Year / Service filters. */
  async facets(): Promise<CaseStudyFacets> {
    const [cities, years, services, totalEvents] = await Promise.all([
      this.prisma.caseStudy.findMany({
        where: { isPublished: true },
        distinct: ['city'],
        select: { city: true },
        orderBy: { city: 'asc' },
      }),
      this.prisma.$queryRaw<Array<{ year: number }>>`
        SELECT DISTINCT EXTRACT(YEAR FROM "eventDate")::int AS year
        FROM "CaseStudy" WHERE "isPublished" = true ORDER BY year DESC`,
      this.prisma.service.findMany({
        where: { isPublished: true },
        select: { slug: true, shortName: true },
        orderBy: { sortOrder: 'asc' },
      }),
      this.prisma.caseStudy.count({ where: { isPublished: true } }),
    ]);
    return {
      totalEvents,
      totalCities: cities.length,
      cities: cities.map((c) => c.city),
      years: years.map((y) => Number(y.year)),
      services,
      eventTypes: EVENT_TYPES.map((value) => ({ value, label: EVENT_TYPE_LABELS[value] })),
    };
  }

  /** Every published slug, for the web app's sitemap and static params. */
  async slugs(): Promise<string[]> {
    const rows = await this.prisma.caseStudy.findMany({ where: { isPublished: true }, select: { slug: true } });
    return rows.map((r) => r.slug);
  }
}
