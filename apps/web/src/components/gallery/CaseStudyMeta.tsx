import type { CaseStudySummary } from '@brandviserproductions/contracts';
import { hasValue } from '@/lib/contact-links';
import { EVENT_TYPE_LABELS } from '@/lib/labels';

/** "[Event type] · [City] · [Year]" line used under every case study title. An unconfirmed city is left out. */
export function caseStudyMeta(study: Pick<CaseStudySummary, 'eventType' | 'city' | 'year'>, withType = true): string {
  return [withType ? EVENT_TYPE_LABELS[study.eventType] : null, hasValue(study.city) ? study.city : null, String(study.year)]
    .filter(Boolean)
    .join(' · ');
}

export const caseStudyTitle = (study: Pick<CaseStudySummary, 'client' | 'title'>) => `${study.client} · ${study.title}`;
