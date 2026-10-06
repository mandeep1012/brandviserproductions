import Link from 'next/link';
import type { CaseStudySummary } from '@brandviserproductions/contracts';
import { EventImage } from '@/components/common/EventImage';
import { EVENT_TYPE_TAGS } from '@/lib/labels';
import { cn } from '@/lib/utils';
import { caseStudyMeta, caseStudyTitle } from './CaseStudyMeta';

const tag = 'eyebrow inline-block rounded-sm border border-rule px-2 py-1 tracking-[0.04em] text-ink';

/**
 * Gallery tile. Captions are always visible (no hover-only information), so it works the same
 * on touch screens. `compact` is the small two-up tile used on phones.
 */
export function CaseStudyCard({ study, compact = false }: { study: CaseStudySummary; compact?: boolean }) {
  return (
    <Link href={`/gallery/${study.slug}`} className="group block text-ink hover:text-ink">
      <EventImage
        src={study.coverImageUrl}
        alt={caseStudyTitle(study)}
        sizes="(min-width: 48rem) 33vw, 50vw"
        className="aspect-[4/3] w-full"
      />
      <h3
        className={cn(
          'mt-2 group-hover:underline md:mt-4',
          compact ? 'text-[15px] leading-5 font-semibold md:text-h3 md:text-[20px] md:leading-7' : 'text-h3 md:text-[20px] md:leading-7',
        )}
      >
        {caseStudyTitle(study)}
      </h3>
      <p className="text-small mt-0.5 mb-2.5 text-slate">{caseStudyMeta(study, false)}</p>
      <p className={cn('flex flex-wrap gap-1.5', compact && 'max-md:hidden')}>
        <span className={tag}>{EVENT_TYPE_TAGS[study.eventType]}</span>
        {study.services[0] && <span className={tag}>{study.services[0].shortName}</span>}
      </p>
    </Link>
  );
}
