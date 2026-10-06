import { Injectable } from '@nestjs/common';
import type { TeamMember } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { displayOrder } from '../../common/utils/paginate.js';

@Injectable()
export class TeamService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<TeamMember[]> {
    const rows = await this.prisma.teamMember.findMany({ where: { isPublished: true }, orderBy: displayOrder() });
    return rows.map(({ id, name, role, portraitUrl }) => ({ id, name, role, portraitUrl }));
  }
}
