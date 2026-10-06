import { Injectable } from '@nestjs/common';
import type { Faq } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { displayOrder } from '../../common/utils/paginate.js';
import type { FaqPage } from '../../generated/prisma/enums.js';

@Injectable()
export class FaqsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(page: FaqPage): Promise<Faq[]> {
    const rows = await this.prisma.faq.findMany({ where: { page, isPublished: true }, orderBy: displayOrder() });
    return rows.map(({ id, question, answer }) => ({ id, question, answer }));
  }
}
