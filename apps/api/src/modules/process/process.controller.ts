import { Controller, Get } from '@nestjs/common';
import type { ProcessStep } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { ProcessService } from './process.service.js';

@Controller({ path: 'process-steps', version: '1' })
@CacheControl(CONTENT_CACHE)
export class ProcessController {
  constructor(private readonly process: ProcessService) {}

  /** GET /api/v1/process-steps: Meet & Agree → Build & Execute. */
  @Get()
  list(): Promise<ProcessStep[]> {
    return this.process.list();
  }
}
