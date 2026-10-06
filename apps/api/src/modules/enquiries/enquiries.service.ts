import { createHash } from 'node:crypto';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { waitUntil } from '@vercel/functions';
import type { EnquiryCreated } from '@brandviserproductions/contracts';
import type { Env } from '../../config/env.validation.js';
import type { Prisma } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { NotificationsService } from '../notifications/notifications.service.js';
import { ServicesService } from '../services/services.service.js';
import type { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import type { QuickEnquiryDto } from './dto/quick-enquiry.dto.js';
import { decoyReference, formatReference } from './enquiry-reference.js';

export interface RequestMeta {
  ip?: string;
  userAgent?: string;
}

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly services: ServicesService,
    private readonly notifications: NotificationsService,
    private readonly config: ConfigService<Env, true>,
  ) {}

  async create(dto: CreateEnquiryDto, meta: RequestMeta): Promise<EnquiryCreated> {
    if (dto.website) return this.decoy();
    await this.assertKnownServices(dto.services);
    return this.save(
      {
        source: 'CONTACT',
        serviceSlugs: dto.services,
        eventType: dto.eventType,
        city: dto.city,
        eventMonth: dto.eventMonth,
        audienceSize: dto.audienceSize,
        budgetRange: dto.budgetRange,
        name: dto.name,
        company: dto.company,
        email: dto.email.toLowerCase(),
        phone: dto.phone,
        brief: dto.brief,
        attachmentUrl: dto.attachmentUrl,
        attachmentName: dto.attachmentUrl ? (dto.attachmentName ?? 'brief.pdf') : null,
        consentAt: new Date(),
      },
      meta,
    );
  }

  async createQuick(dto: QuickEnquiryDto, meta: RequestMeta): Promise<EnquiryCreated> {
    if (dto.website) return this.decoy();
    return this.save({ source: 'HOME_QUICK', name: dto.name, phone: dto.phone, eventType: dto.eventType }, meta);
  }

  /**
   * Inserts, then derives the reference from the row's sequence number in the same
   * transaction. The email goes out after the response via `waitUntil`.
   */
  private async save(data: Prisma.EnquiryCreateInput, meta: RequestMeta): Promise<EnquiryCreated> {
    const enquiry = await this.prisma.$transaction(async (tx) => {
      const created = await tx.enquiry.create({
        data: { ...data, ipHash: hashIp(meta.ip), userAgent: meta.userAgent?.slice(0, 300) },
      });
      return tx.enquiry.update({
        where: { id: created.id },
        data: { reference: formatReference(created.number, created.createdAt) },
      });
    });
    this.logger.log(`Enquiry ${enquiry.reference} received (${enquiry.source})`);
    waitUntil(this.notifications.sendEnquiryEmail(enquiry));
    return { reference: enquiry.reference!, schedulerUrl: this.config.get('SCHEDULER_URL', { infer: true }) ?? null };
  }

  private async assertKnownServices(slugs: string[]): Promise<void> {
    if (slugs.length === 0) return;
    const known = await this.services.publishedSlugs();
    const unknown = slugs.filter((slug) => !known.has(slug));
    if (unknown.length > 0) {
      const message = `Unknown service: ${unknown.join(', ')}`;
      throw new BadRequestException({ statusCode: 400, error: 'Bad Request', message: [message], fields: { services: message } });
    }
  }

  private decoy(): EnquiryCreated {
    this.logger.warn('Honeypot field filled; enquiry discarded');
    return { reference: decoyReference(), schedulerUrl: this.config.get('SCHEDULER_URL', { infer: true }) ?? null };
  }
}

function hashIp(ip: string | undefined): string | null {
  return ip ? createHash('sha256').update(`bvp:${ip}`).digest('hex') : null;
}
