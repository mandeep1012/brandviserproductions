import { Injectable } from '@nestjs/common';
import type { Testimonial } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { displayOrder } from '../../common/utils/paginate.js';
import type { ListTestimonialsQuery } from './dto/list-testimonials.query.js';
import { toTestimonial } from './testimonials.mapper.js';

@Injectable()
export class TestimonialsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListTestimonialsQuery): Promise<Testimonial[]> {
    const rows = await this.prisma.testimonial.findMany({
      where: { isPublished: true, ...(query.featured === undefined ? {} : { isFeatured: query.featured }) },
      orderBy: displayOrder(),
      take: query.limit,
    });
    return rows.map(toTestimonial);
  }
}
