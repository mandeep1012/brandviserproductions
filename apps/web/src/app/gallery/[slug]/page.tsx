import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CtaBand } from '@/components/common/CtaBand';
import { EventImage } from '@/components/common/EventImage';
import { Eyebrow } from '@/components/common/Eyebrow';
import { Section } from '@/components/common/Section';
import { caseStudyMeta, caseStudyTitle } from '@/components/gallery/CaseStudyMeta';
import { api, optional } from '@/lib/api/server';
import { hasValue } from '@/lib/contact-links';
import { EVENT_TYPE_LABELS } from '@/lib/labels';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const revalidate = 300;

type Params = { params: Promise<{ slug: string }> };

/** Prebuild known case studies; new ones render on first request and are then cached. */
export async function generateStaticParams() {
  const slugs = (await optional(api.caseStudySlugs())) ?? [];
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const study = await api.caseStudy((await params).slug);
  return {
    title: caseStudyTitle(study),
    description: study.summary,
    openGraph: { images: [{ url: study.coverImageUrl }] },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const study = await api.caseStudy((await params).slug);
  const numbers = [
    { label: 'Attendees', value: study.attendees },
    { label: 'Cities', value: study.citiesCount },
    { label: 'Days', value: study.days },
  ].filter((n): n is { label: string; value: number } => n.value !== null);

  return (
    <>
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { href: '/gallery', label: 'Gallery' }, { label: study.title }]} />

      <section className="gutter grid gap-6 pt-4 pb-10 md:grid-cols-12 md:items-end md:gap-6 md:pt-8 md:pb-16">
        <div className="flex flex-col gap-3 md:col-span-7 md:gap-4">
          <Eyebrow rule>{EVENT_TYPE_LABELS[study.eventType]}</Eyebrow>
          <h1 className="text-h1">{caseStudyTitle(study)}</h1>
          <p className="text-small text-slate">{caseStudyMeta(study, false)}</p>
          <p className="max-w-[560px]">{study.summary}</p>
        </div>
        {numbers.length > 0 && (
          <dl className="grid grid-cols-3 gap-3 border-t border-rule pt-4 md:col-span-5">
            {numbers.map((n) => (
              <div key={n.label} className="flex flex-col-reverse">
                <dt className="eyebrow text-slate">{n.label}</dt>
                <dd className="self-start text-h2 text-metal">{n.value.toLocaleString('en-IN')}</dd>
              </div>
            ))}
          </dl>
        )}
      </section>

      <div className="gutter">
        <EventImage
          src={study.coverImageUrl}
          alt={caseStudyTitle(study)}
          priority
          sizes="100vw"
          className="aspect-[4/3] md:aspect-[16/7]"
        />
      </div>

      <Section className="grid gap-8 md:grid-cols-12 md:gap-6">
        <aside className="flex flex-col gap-4 md:col-span-4">
          <div>
            <p className="eyebrow mb-2 text-slate">Services</p>
            <ul className="flex flex-wrap gap-1.5">
              {study.services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/expertise#${service.slug}`}
                    className="eyebrow inline-flex min-h-9 items-center rounded-sm border border-rule px-2 tracking-[0.04em] text-ink hover:border-navy hover:text-navy"
                  >
                    {service.shortName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-1 text-slate">Date</p>
            <p>
              {new Date(study.eventDate).toLocaleDateString('en-IN', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
            </p>
          </div>
        </aside>
        <div className="flex flex-col gap-5 md:col-span-8">
          {study.body
            .split(/\n{2,}/)
            .filter((paragraph) => hasValue(paragraph))
            .map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          {study.testimonial && (
            <figure className="mt-4 border-t border-gold-500 pt-6">
              <blockquote className="font-serif text-2xl leading-8 text-navy md:text-[30px] md:leading-[38px]">
                {study.testimonial.quote}
              </blockquote>
              <figcaption className="text-small mt-3 text-slate">
                {[study.testimonial.name, study.testimonial.role, study.testimonial.company].filter(hasValue).join(', ')}
              </figcaption>
            </figure>
          )}
        </div>
      </Section>

      {study.gallery.length > 0 && (
        <Section spacing="none" className="pb-12 md:pb-24">
          <h2 className="sr-only">Photographs</h2>
          <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-6">
            {study.gallery.map((src, index) => (
              <li key={src}>
                <EventImage
                  src={src}
                  alt={`${caseStudyTitle(study)}, photograph ${index + 1}`}
                  sizes="(min-width: 48rem) 25vw, 50vw"
                  className="aspect-[4/3]"
                />
              </li>
            ))}
          </ul>
        </Section>
      )}

      <CtaBand
        title="Planning something like this?"
        text="Share the brief and we will send a concept."
        href={ENQUIRY_HREF}
        label="Plan an event"
      />
    </>
  );
}
