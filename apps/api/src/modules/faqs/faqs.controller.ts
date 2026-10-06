import { Controller, Get, Query } from '@nestjs/common';
import type { Faq } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { ListFaqsQuery } from './dto/list-faqs.query.js';
import { FaqsService } from './faqs.service.js';

@Controller({ path: 'faqs', version: '1' })
@CacheControl(CONTENT_CACHE)
export class FaqsController {
  constructor(private readonly faqs: FaqsService) {}

  /** GET /api/v1/faqs?page=expertise|contact */
  @Get()
  list(@Query() query: ListFaqsQuery): Promise<Faq[]> {
    return this.faqs.list(query.page);
  }
}
