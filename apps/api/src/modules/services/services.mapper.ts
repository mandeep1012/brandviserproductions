import type { Service as ServiceDto, ServiceMatrix } from '@brandviserproductions/contracts';
import type { EventTypeOffering, Service } from '../../generated/prisma/client.js';
import { EVENT_TYPE_LABELS, EVENT_TYPES } from '../../common/labels.js';

export function toService(row: Service): ServiceDto {
  return {
    id: row.id,
    slug: row.slug,
    number: row.number,
    name: row.name,
    shortName: row.shortName,
    line: row.line,
    description: row.description,
    deliverables: row.deliverables,
    imageUrl: row.imageUrl,
  };
}

/** One row per event type (in a fixed order), listing the services typically included. */
export function toMatrix(services: Service[], offerings: EventTypeOffering[]): ServiceMatrix {
  const slugById = new Map(services.map((s) => [s.id, s.slug]));
  return {
    services: services.map((s) => ({ slug: s.slug, shortName: s.shortName })),
    rows: EVENT_TYPES.map((eventType) => ({
      eventType,
      label: EVENT_TYPE_LABELS[eventType],
      serviceSlugs: offerings
        .filter((o) => o.eventType === eventType)
        .map((o) => slugById.get(o.serviceId))
        .filter((slug): slug is string => slug !== undefined),
    })),
  };
}
