import type { Metadata } from 'next';
import { CtaBand } from '@/components/common/CtaBand';
import { Eyebrow } from '@/components/common/Eyebrow';
import { CaseStudyGrid } from '@/components/gallery/CaseStudyGrid';
import { FeaturedCase } from '@/components/gallery/FeaturedCase';
import { api, optional } from '@/lib/api/server';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Corporate events, product launches, brand activations, conferences and exhibitions staged by BRANDVISER.',
};

/** The API's largest page size: the whole gallery in one request. */
const GALLERY_LIMIT = 48;

export default async function GalleryPage() {
  const [results, featuredList, site] = await Promise.all([
    api.caseStudies({ limit: GALLERY_LIMIT }),
    optional(api.caseStudies({ featured: true, limit: 1 })),
    optional(api.site()),
  ]);
  const featuredSlug = featuredList?.items[0]?.slug;
  const featured = featuredSlug ? await optional(api.caseStudy(featuredSlug)) : null;
  // Company-wide numbers from the site settings (the same ones as the home page), not a count of the
  // photos in the gallery. A number the API doesn't send yet is left out.
  const highlights = [
    { value: site?.stats.eventsDelivered, label: 'projects delivered' },
    { value: site?.stats.citiesCovered, label: 'cities' },
    { value: site?.stats.countriesCovered, label: 'countries' },
  ].filter((item): item is { value: number; label: string } => typeof item.value === 'number');

  return (
    <>
      <section className="gutter flex flex-col gap-3 pt-8 pb-6 md:pt-16 md:pb-12">
        <Eyebrow rule>The gallery</Eyebrow>
        <h1 className="text-h1">
          Where ideas took the <em className="text-metal">stage.</em>
        </h1>
        <p className="max-w-[640px]">
          A curated look at experiences designed, built and delivered, from mall activations to business conference
          meetups to award nights and retreats abroad. Each one crafted to be remembered.
        </p>
        {highlights.length > 0 && (
          <p className="text-small text-slate">
            {highlights.map((item) => `${item.value.toLocaleString('en-IN')}+ ${item.label}`).join(' · ')}
          </p>
        )}
      </section>

      {featured && <FeaturedCase study={featured} />}

      <section aria-label="Case studies" className="gutter pt-6 pb-12 md:pt-4 md:pb-16">
        <CaseStudyGrid studies={results.items} />
      </section>

      <CtaBand
        title="Planning something like this?"
        text="Share the brief and we will send a concept."
        href={ENQUIRY_HREF}
        label="Plan an event"
      />
    </>
  );
}
