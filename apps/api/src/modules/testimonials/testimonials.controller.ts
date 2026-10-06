import { Controller, Get, Query } from '@nestjs/common';
import type { Testimonial } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { ListTestimonialsQuery } from './dto/list-testimonials.query.js';
import { TestimonialsService } from './testimonials.service.js';

@Controller({ path: 'testimonials', version: '1' })
@CacheControl(CONTENT_CACHE)
export class TestimonialsController {
  constructor(private readonly testimonials: TestimonialsService) {}

  /** GET /api/v1/testimonials?featured=true&limit=3 */
  @Get()
  list(@Query() query: ListTestimonialsQuery): Promise<Testimonial[]> {
    return this.testimonials.list(query);
  }
}
