import { Controller, Get } from '@nestjs/common';
import type { Service, ServiceMatrix } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { ServicesService } from './services.service.js';

@Controller({ path: 'services', version: '1' })
@CacheControl(CONTENT_CACHE)
export class ServicesController {
  constructor(private readonly services: ServicesService) {}

  /** GET /api/v1/services: the five practices with their deliverables. */
  @Get()
  list(): Promise<Service[]> {
    return this.services.list();
  }

  /** GET /api/v1/services/matrix: "What each event type draws on". */
  @Get('matrix')
  matrix(): Promise<ServiceMatrix> {
    return this.services.matrix();
  }
}
