import { Injectable } from '@nestjs/common';
import type { Service, ServiceMatrix } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { displayOrder } from '../../common/utils/paginate.js';
import { toMatrix, toService } from './services.mapper.js';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(): Promise<Service[]> {
    const rows = await this.prisma.service.findMany({ where: { isPublished: true }, orderBy: displayOrder() });
    return rows.map(toService);
  }

  async matrix(): Promise<ServiceMatrix> {
    const [services, offerings] = await this.prisma.$transaction([
      this.prisma.service.findMany({ where: { isPublished: true }, orderBy: displayOrder() }),
      this.prisma.eventTypeOffering.findMany(),
    ]);
    return toMatrix(services, offerings);
  }

  /** Published slugs, used to validate enquiry service choices. */
  async publishedSlugs(): Promise<Set<string>> {
    const rows = await this.prisma.service.findMany({ where: { isPublished: true }, select: { slug: true } });
    return new Set(rows.map((r) => r.slug));
  }
}
