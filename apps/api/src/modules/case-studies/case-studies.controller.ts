import { Controller, Get, Param, Query } from '@nestjs/common';
import type { CaseStudyDetail, CaseStudyFacets, CaseStudySummary, Paginated } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { ParseSlugPipe } from '../../common/pipes/parse-slug.pipe.js';
import { CaseStudiesService } from './case-studies.service.js';
import { ListCaseStudiesQuery } from './dto/list-case-studies.query.js';

@Controller({ path: 'case-studies', version: '1' })
@CacheControl(CONTENT_CACHE)
export class CaseStudiesController {
  constructor(private readonly caseStudies: CaseStudiesService) {}

  /** GET /api/v1/case-studies?type&service&city&year&featured&page&limit */
  @Get()
  list(@Query() query: ListCaseStudiesQuery): Promise<Paginated<CaseStudySummary>> {
    return this.caseStudies.list(query);
  }

  /** GET /api/v1/case-studies/facets. Declared before `:slug` so it is not read as a slug. */
  @Get('facets')
  facets(): Promise<CaseStudyFacets> {
    return this.caseStudies.facets();
  }

  @Get('slugs')
  slugs(): Promise<string[]> {
    return this.caseStudies.slugs();
  }

  @Get(':slug')
  bySlug(@Param('slug', ParseSlugPipe) slug: string): Promise<CaseStudyDetail> {
    return this.caseStudies.bySlug(slug);
  }
}
