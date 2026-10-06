import type { Testimonial as TestimonialDto } from '@brandviserproductions/contracts';
import type { Testimonial } from '../../generated/prisma/client.js';

export function toTestimonial(row: Testimonial): TestimonialDto {
  return { id: row.id, quote: row.quote, name: row.name, role: row.role, company: row.company };
}
