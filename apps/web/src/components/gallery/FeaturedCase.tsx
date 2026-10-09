import Link from 'next/link';
import type { CaseStudyDetail } from '@brandviserproductions/contracts';
import { EventImage } from '@/components/common/EventImage';
import { Eyebrow } from '@/components/common/Eyebrow';
import { Button } from '@/components/ui/button';
import { caseStudyMeta, caseStudyTitle } from './CaseStudyMeta';

/** Large featured case study at the top of the gallery. */
export function FeaturedCase({ study }: { study: CaseStudyDetail }) {
  const numbers = [
    { label: 'Attendees', value: study.attendees },
    { label: 'Cities', value: study.citiesCount },
    { label: 'Days', value: study.days },
  ].filter((n): n is { label: string; value: number } => n.value !== null);

  return (
    <section
      aria-labelledby="featured-heading"
      className="gutter grid gap-4 border-b border-rule py-6 md:grid-cols-12 md:items-center md:gap-6 md:border-0 md:py-12"
    >
      <EventImage
        src={study.coverImageUrl}
        alt={caseStudyTitle(study)}
        priority
        sizes="(min-width: 48rem) 66vw, 100vw"
        className="aspect-[4/3] md:col-span-8 md:aspect-auto md:h-105"
      />
      <div className="flex flex-col gap-2 md:col-span-4 md:gap-4 md:pl-6">
        <Eyebrow rule>Featured case study</Eyebrow>
        <h2 id="featured-heading" className="text-h2">
          {caseStudyTitle(study)}
        </h2>
        <p className="text-small text-slate">{caseStudyMeta(study)}</p>
        {numbers.length > 0 && (
          <dl className="grid grid-cols-3 gap-3 border-t border-rule pt-4">
            {numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse">
                <dt className="eyebrow text-slate">{n.label}</dt>
                <dd className="self-start font-serif text-[30px] leading-9 text-metal">{n.value.toLocaleString('en-IN')}</dd>
              </div>
            ))}
          </dl>
        )}
        <Button asChild variant="outline" className="mt-2 md:self-start">
          <Link href={`/gallery/${study.slug}`}>Read case study</Link>
        </Button>
      </div>
    </section>
  );
}
