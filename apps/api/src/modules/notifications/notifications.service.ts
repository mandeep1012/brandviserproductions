import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { get } from '@vercel/blob';
import { Resend } from 'resend';
import type { Env } from '../../config/env.validation.js';
import type { Enquiry } from '../../generated/prisma/client.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { enquiryHtml, enquirySubject, enquiryText } from './enquiry-email.js';

/** Resend's limit is 40 MB per email; briefs are capped at 10 MB on upload. */
const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend | null;

  constructor(
    private readonly config: ConfigService<Env, true>,
    private readonly prisma: PrismaService,
  ) {
    const key = this.config.get('RESEND_API_KEY', { infer: true });
    this.resend = key ? new Resend(key) : null;
  }

  /**
   * Emails the team about a new enquiry. Never throws: the enquiry is already saved, so a mail
   * outage must not turn into a failed submission. `notifiedAt` records successful delivery.
   */
  async sendEnquiryEmail(enquiry: Enquiry): Promise<void> {
    const to = this.config.get('ENQUIRY_NOTIFY_TO', { infer: true });
    const from = this.config.get('ENQUIRY_FROM', { infer: true });
    if (!this.resend || !to || !from) {
      this.logger.warn(`Email not configured; enquiry ${enquiry.reference} saved without notification`);
      this.logger.log(enquiryText(enquiry));
      return;
    }
    try {
      const attachment = await this.loadAttachment(enquiry);
      const { error } = await this.resend.emails.send({
        from,
        to: to.split(',').map((address) => address.trim()),
        replyTo: enquiry.email ?? undefined,
        subject: enquirySubject(enquiry),
        text: enquiryText(enquiry),
        html: enquiryHtml(enquiry),
        attachments: attachment ? [attachment] : undefined,
      });
      if (error) throw new Error(`${error.name}: ${error.message}`);
      await this.prisma.enquiry.update({ where: { id: enquiry.id }, data: { notifiedAt: new Date() } });
    } catch (error) {
      this.logger.error(`Enquiry ${enquiry.reference} notification failed: ${String(error)}`);
    }
  }

  /** Reads the private brief from Vercel Blob so the team gets it in the email itself. */
  private async loadAttachment(enquiry: Enquiry): Promise<{ filename: string; content: Buffer } | null> {
    if (!enquiry.attachmentUrl) return null;
    try {
      const result = await get(enquiry.attachmentUrl, {
        access: 'private',
        token: this.config.get('BLOB_READ_WRITE_TOKEN', { infer: true }),
      });
      if (!result || result.statusCode !== 200 || result.blob.size > MAX_ATTACHMENT_BYTES) return null;
      const content = Buffer.from(await new Response(result.stream).arrayBuffer());
      return { filename: enquiry.attachmentName ?? 'brief.pdf', content };
    } catch (error) {
      this.logger.warn(`Could not attach brief for ${enquiry.reference}: ${String(error)}`);
      return null;
    }
  }
}
