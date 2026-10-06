import { describe, expect, it } from 'vitest';
import { buildCaseStudyWhere } from './case-studies.filters.js';

describe('buildCaseStudyWhere', () => {
  it('always restricts to published case studies', () => {
    expect(buildCaseStudyWhere({})).toEqual({ isPublished: true });
  });

  it('maps each filter onto its column', () => {
    expect(
      buildCaseStudyWhere({ type: 'CONFERENCE', service: 'btl', city: 'Pune', featured: true }),
    ).toEqual({
      isPublished: true,
      eventType: 'CONFERENCE',
      isFeatured: true,
      city: { equals: 'Pune', mode: 'insensitive' },
      services: { some: { slug: 'btl', isPublished: true } },
    });
  });

  it('turns a year into a half-open UTC date range', () => {
    const where = buildCaseStudyWhere({ year: 2025 });
    expect(where.eventDate).toEqual({
      gte: new Date('2025-01-01T00:00:00.000Z'),
      lt: new Date('2026-01-01T00:00:00.000Z'),
    });
  });

  it('keeps featured=false as a real filter', () => {
    expect(buildCaseStudyWhere({ featured: false })).toEqual({ isPublished: true, isFeatured: false });
  });
});
