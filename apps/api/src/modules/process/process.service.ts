import { Injectable } from '@nestjs/common';
import type { ProcessStep } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { displayOrder } from '../../common/utils/paginate.js';

@Injectable()
export class ProcessService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<ProcessStep[]> {
    const rows = await this.prisma.processStep.findMany({ orderBy: displayOrder() });
    return rows.map(({ id, number, name, line, detail, deliverable, duration }) => ({
      id,
      number,
      name,
      line,
      detail,
      deliverable,
      duration,
    }));
  }
}
