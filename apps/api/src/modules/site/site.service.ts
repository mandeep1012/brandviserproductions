import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import type { SiteInfo } from '@brandviserproductions/contracts';
import { PrismaService } from '../../prisma/prisma.service.js';
import { displayOrder } from '../../common/utils/paginate.js';
import { toSiteInfo } from './site.mapper.js';

export const SITE_SETTINGS_ID = 1;

@Injectable()
export class SiteService {
  constructor(private readonly prisma: PrismaService) {}

  async get(): Promise<SiteInfo> {
    const [settings, logos] = await Promise.all([
      this.prisma.siteSettings.findUnique({ where: { id: SITE_SETTINGS_ID } }),
      this.prisma.clientLogo.findMany({ where: { isPublished: true }, orderBy: displayOrder() }),
    ]);
    // The row is created by the seed; without it the site cannot render contact details.
    if (!settings) throw new ServiceUnavailableException('Site settings have not been configured');
    return toSiteInfo(settings, logos);
  }
}
