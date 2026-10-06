import type { Metadata } from 'next';
import { CtaBand } from '@/components/common/CtaBand';
import { Eyebrow } from '@/components/common/Eyebrow';
import { FeaturedCase } from '@/components/gallery/FeaturedCase';
import { GalleryBrowser } from '@/components/gallery/GalleryBrowser';
import { api, optional } from '@/lib/api/server';
import { hasFilters, parseGalleryParams, toApiQuery } from '@/lib/gallery';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Corporate events, product launches, brand activations, conferences and exhibitions staged by BRANDVISER.',
};

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { filters, page } = parseGalleryParams(await searchParams);
  const showFeatured = !hasFilters(filters) && page === 1;

  const [facets, results, featuredList] = await Promise.all([
    api.caseStudyFacets(),
    api.caseStudies(toApiQuery(filters, page)),
    showFeatured ? optional(api.caseStudies({ featured: true, limit: 1 })) : null,
  ]);
  const featuredSlug = featuredList?.items[0]?.slug;
  const featured = featuredSlug ? await optional(api.caseStudy(featuredSlug)) : null;

  return (
    <>
      <section className="gutter flex flex-col gap-3 pt-8 pb-6 md:pt-16 md:pb-12">
        <Eyebrow>The gallery</Eyebrow>
        <h1 className="text-h1">Work we have staged.</h1>
        <p className="text-small text-slate">
          {facets.totalEvents} events · {facets.totalCities} cities
        </p>
      </section>

      <GalleryBrowser
        facets={facets}
        filters={filters}
        initialPage={results}
        featured={featured ? <FeaturedCase study={featured} /> : null}
      />

      <CtaBand
        title="Planning something like this?"
        text="Share the brief and we will send a concept."
        href={ENQUIRY_HREF}
        label="Plan an event"
      />
    </>
  );
}
