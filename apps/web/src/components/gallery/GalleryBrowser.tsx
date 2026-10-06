'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import type { CaseStudyFacets, CaseStudySummary, Paginated } from '@brandviserproductions/contracts';
import { galleryHref, type GalleryFilters as Filters } from '@/lib/gallery';
import { cn } from '@/lib/utils';
import { CaseStudyGrid } from './CaseStudyGrid';
import { GalleryFilters } from './GalleryFilters';

interface GalleryBrowserProps {
  facets: CaseStudyFacets;
  filters: Filters;
  initialPage: Paginated<CaseStudySummary>;
  featured?: React.ReactNode;
}

/** Filter bar + results. While a new filter loads, the current results dim instead of vanishing. */
export function GalleryBrowser({ facets, filters, initialPage, featured }: GalleryBrowserProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const navigate = (href: string) => startTransition(() => router.push(href, { scroll: false }));
  const filterKey = JSON.stringify([filters, initialPage.page]);

  return (
    <>
      <GalleryFilters facets={facets} filters={filters} onNavigate={navigate} />
      <div aria-busy={pending} className={cn('transition-opacity', pending && 'pointer-events-none opacity-50')}>
        {featured}
        <section aria-label="Case studies" className="gutter pt-6 pb-12 md:pt-4 md:pb-16">
          <CaseStudyGrid
            key={filterKey}
            filters={filters}
            initialPage={initialPage}
            onClear={() => navigate(galleryHref({}))}
          />
        </section>
      </div>
    </>
  );
}
