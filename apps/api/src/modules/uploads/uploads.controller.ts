import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  ServiceUnavailableException,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import type { Request } from 'express';
import { CacheControl } from '../../common/decorators/cache-control.decorator.js';
import { RateLimit, RateLimitGuard } from '../../common/guards/rate-limit.guard.js';
import type { Env } from '../../config/env.validation.js';

export const MAX_BRIEF_BYTES = 10 * 1024 * 1024;
const TOKEN_LIFETIME_MS = 10 * 60 * 1000;
const BRIEF_PATH = /^briefs\/[\w .()-]{1,160}\.pdf$/i;

/**
 * POST /api/v1/uploads/brief: the Vercel Blob client-upload handshake.
 *
 * The browser asks this route for a short-lived token scoped to one PDF of at most 10 MB,
 * then uploads straight to Blob. The file never passes through the function, which keeps
 * it clear of the 4.5 MB request body limit. The resulting URL is sent with the enquiry,
 * which validates it again.
 */
@Controller({ path: 'uploads', version: '1' })
@CacheControl('no-store')
@UseGuards(RateLimitGuard)
@RateLimit({ limit: 10, windowMs: 60_000 })
export class UploadsController {
  constructor(private readonly config: ConfigService<Env, true>) {}

  @Post('brief')
  @HttpCode(HttpStatus.OK)
  async brief(@Body() body: HandleUploadBody, @Req() req: Request): Promise<unknown> {
    const token = this.config.get('BLOB_READ_WRITE_TOKEN', { infer: true });
    if (!token) throw new ServiceUnavailableException('File uploads are not configured');
    if (body?.type !== 'blob.generate-client-token') {
      throw new BadRequestException('Unsupported upload event');
    }
    try {
      return await handleUpload({
        token,
        request: req,
        body,
        onBeforeGenerateToken: async (pathname) => {
          if (!BRIEF_PATH.test(pathname)) throw new Error('Only PDF briefs can be uploaded');
          return {
            allowedContentTypes: ['application/pdf'],
            maximumSizeInBytes: MAX_BRIEF_BYTES,
            addRandomSuffix: true,
            validUntil: Date.now() + TOKEN_LIFETIME_MS,
          };
        },
      });
    } catch (error) {
      throw new BadRequestException(error instanceof Error ? error.message : 'Upload rejected');
    }
  }
}
