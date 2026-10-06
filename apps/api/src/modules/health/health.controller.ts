import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { CacheControl } from '../../common/decorators/cache-control.decorator.js';
import { HealthService } from './health.service.js';
import type { HealthReport } from './health.types.js';

@Controller({ path: 'health', version: '1' })
@CacheControl('no-store')
export class HealthController {
  constructor(private readonly health: HealthService) {}

  /**
   * GET /api/v1/health: deployment, instance and dependency status.
   * 200 when `ok` or `degraded`; 503 when the database is unreachable, so uptime monitors alert.
   */
  @Get()
  async check(): Promise<HealthReport> {
    const report = await this.health.report();
    if (report.status === 'down') throw new ServiceUnavailableException(report);
    return report;
  }
}
