import { Controller, Get } from '@nestjs/common';
import type { TeamMember } from '@brandviserproductions/contracts';
import { CacheControl, CONTENT_CACHE } from '../../common/decorators/cache-control.decorator.js';
import { TeamService } from './team.service.js';

@Controller({ path: 'team', version: '1' })
@CacheControl(CONTENT_CACHE)
export class TeamController {
  constructor(private readonly team: TeamService) {}

  @Get()
  list(): Promise<TeamMember[]> {
    return this.team.list();
  }
}
