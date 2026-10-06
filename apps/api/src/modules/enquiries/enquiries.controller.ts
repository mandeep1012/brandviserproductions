import { Body, Controller, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';
import type { EnquiryCreated } from '@brandviserproductions/contracts';
import { CacheControl } from '../../common/decorators/cache-control.decorator.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { QuickEnquiryDto } from './dto/quick-enquiry.dto.js';
import { EnquiriesService, type RequestMeta } from './enquiries.service.js';

const meta = (req: Request): RequestMeta => ({ ip: req.ip, userAgent: req.get('user-agent') });

/**
 * Throttled per IP and per function instance (5 per minute). Pair it with a Vercel Firewall
 * rate-limit rule on /api/v1/enquiries* for a limit that holds across instances.
 */
@Controller({ path: 'enquiries', version: '1' })
@CacheControl('no-store')
@UseGuards(ThrottlerGuard)
@Throttle({ default: { limit: 5, ttl: 60_000 } })
export class EnquiriesController {
  constructor(private readonly enquiries: EnquiriesService) {}

  /** POST /api/v1/enquiries: Contact & Booking form. */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateEnquiryDto, @Req() req: Request): Promise<EnquiryCreated> {
    return this.enquiries.create(dto, meta(req));
  }

  /** POST /api/v1/enquiries/quick: home page quick form. */
  @Post('quick')
  @HttpCode(HttpStatus.CREATED)
  createQuick(@Body() dto: QuickEnquiryDto, @Req() req: Request): Promise<EnquiryCreated> {
    return this.enquiries.createQuick(dto, meta(req));
  }
}
