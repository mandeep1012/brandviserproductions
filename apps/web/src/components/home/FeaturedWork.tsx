import Link from 'next/link';
import type { CaseStudySummary } from '@brandviserproductions/contracts';
import { EventImage } from '@/components/common/EventImage';
import { caseStudyMeta, caseStudyTitle } from '@/components/gallery/CaseStudyMeta';
import { cn } from '@/lib/utils';

function Tile({ study, size }: { study: CaseStudySummary; size: 'large' | 'small' }) {
  return (
    <Link href={`/gallery/${study.slug}`} className="group block text-ink hover:text-ink">
      <EventImage
        src={study.coverImageUrl}
        alt={caseStudyTitle(study)}
        sizes={size === 'large' ? '(min-width: 64rem) 60vw, 300px' : '(min-width: 64rem) 30vw, 300px'}
        className={cn('aspect-[4/3] w-full', size === 'large' ? 'lg:aspect-auto lg:h-110' : 'lg:aspect-auto lg:h-45')}
      />
      <h3 className="text-h3 mt-3 group-hover:underline md:mt-4">{caseStudyTitle(study)}</h3>
      <p className="text-small text-slate">{caseStudyMeta(study)}</p>
    </Link>
  );
}

/** One large and two small case studies on desktop; a swipeable row on mobile. */
export function FeaturedWork({ studies }: { studies: CaseStudySummary[] }) {
  const [first, ...rest] = studies;
  if (!first) return null;
  return (
    <>
      <div className="hidden gap-6 lg:grid lg:grid-cols-12">
        <div className="col-span-8">
          <Tile study={first} size="large" />
        </div>
        <div className="col-span-4 flex flex-col gap-3">
          {rest.slice(0, 2).map((study) => (
            <Tile key={study.id} study={study} size="small" />
          ))}
        </div>
      </div>
      <ul
        aria-label="Featured case studies"
        className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 lg:hidden"
      >
        {studies.slice(0, 3).map((study) => (
          <li key={study.id} className="w-[300px] flex-none snap-start">
            <Tile study={study} size="small" />
          </li>
        ))}
      </ul>
      <p className="eyebrow mt-4 text-slate lg:hidden" aria-hidden="true">
        Swipe for more
      </p>
    </>
  );
}
