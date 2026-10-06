import { Readable } from 'node:stream';
import { Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from '@vercel/blob';
import type { EnquiryAdminView, Paginated } from '@brandviserproductions/contracts';
import type { Env } from '../../config/env.validation.js';
import type { Enquiry } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { orNotFound, pageWindow, toPage } from '../../common/utils/paginate.js';
import type { ListEnquiriesQuery, UpdateEnquiryDto } from './dto/enquiries.dto.js';

function toAdminView(row: Enquiry): EnquiryAdminView {
  return {
    id: row.id,
    reference: row.reference ?? '',
    source: row.source,
    status: row.status,
    services: row.serviceSlugs,
    eventType: row.eventType,
    city: row.city,
    eventMonth: row.eventMonth,
    audienceSize: row.audienceSize,
    budgetRange: row.budgetRange,
    name: row.name,
    company: row.company,
    email: row.email,
    phone: row.phone,
    brief: row.brief,
    attachmentUrl: row.attachmentUrl,
    attachmentName: row.attachmentName,
    createdAt: row.createdAt.toISOString(),
  };
}

@Injectable()
export class AdminEnquiriesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async list(query: ListEnquiriesQuery): Promise<Paginated<EnquiryAdminView>> {
    const where = query.status ? { status: query.status } : {};
    const [rows, total] = await this.prisma.$transaction([
      this.prisma.enquiry.findMany({ where, orderBy: { createdAt: 'desc' }, ...pageWindow(query) }),
      this.prisma.enquiry.count({ where }),
    ]);
    return toPage(rows.map(toAdminView), total, query);
  }

  async get(id: string): Promise<EnquiryAdminView> {
    return toAdminView(orNotFound(await this.prisma.enquiry.findUnique({ where: { id } }), 'Enquiry', id));
  }

  async update(id: string, dto: UpdateEnquiryDto): Promise<EnquiryAdminView> {
    return toAdminView(await this.prisma.enquiry.update({ where: { id }, data: { status: dto.status } }));
  }

  /** Streams the private brief PDF, which is not reachable by URL alone. */
  async attachment(id: string): Promise<StreamableFile> {
    const enquiry = await this.get(id);
    if (!enquiry.attachmentUrl) throw new NotFoundException('This enquiry has no attachment');
    const result = await get(enquiry.attachmentUrl, {
      access: 'private',
      token: this.config.get('BLOB_READ_WRITE_TOKEN', { infer: true }),
    });
    if (!result || result.statusCode !== 200) throw new NotFoundException('Attachment no longer exists');
    return new StreamableFile(Readable.fromWeb(result.stream as import('node:stream/web').ReadableStream), {
      type: 'application/pdf',
      length: result.blob.size,
      disposition: `attachment; filename="${(enquiry.attachmentName ?? 'brief.pdf').replace(/"/g, '')}"`,
    });
  }
}
