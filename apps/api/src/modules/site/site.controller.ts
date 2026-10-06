import { Controller, Get } from '@nestjs/common';
import type { SiteInfo } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { SiteService } from './site.service.js';

@Controller({ path: 'site', version: '1' })
@CacheControl(CONTENT_CACHE)
export class SiteController {
  constructor(private readonly site: SiteService) {}

  /** GET /api/v1/site: contact details, headline stats and client logos. */
  @Get()
  get(): Promise<SiteInfo> {
    return this.site.get();
  }
}
