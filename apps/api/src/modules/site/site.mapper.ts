import type { SiteInfo } from '@brandviserproductions/contracts';
import type { ClientLogo, SiteSettings } from '../../generated/prisma/client.js';

export function toSiteInfo(settings: SiteSettings, logos: ClientLogo[]): SiteInfo {
  return {
    description: settings.description,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    hours: settings.hours,
    mapUrl: settings.mapUrl,
    mapImageUrl: settings.mapImageUrl,
    stats: {
      citiesCovered: settings.citiesCovered,
      clientBrands: settings.clientBrands,
      eventsDelivered: settings.eventsDelivered,
      yearsExperience: settings.yearsExperience,
    },
    clientLogos: logos.map((logo) => ({ id: logo.id, name: logo.name, logoUrl: logo.logoUrl })),
  };
}
