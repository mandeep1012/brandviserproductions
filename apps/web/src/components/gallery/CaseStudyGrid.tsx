'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import type { CaseStudySummary, Paginated } from '@brandviserproductions/contracts';
import { Button } from '@/components/ui/button';
import { useCaseStudies } from '@/lib/api/hooks';
import { galleryHref, type GalleryFilters } from '@/lib/gallery';
import { cn } from '@/lib/utils';
import { CaseStudyCard } from './CaseStudyCard';

interface CaseStudyGridProps {
  filters: GalleryFilters;
  initialPage: Paginated<CaseStudySummary>;
  onClear: () => void;
}

/**
 * The server renders the requested page; "Load more" appends the following pages in place.
 * Numbered page links stay underneath as plain links (no JavaScript needed, crawlable).
 */
export function CaseStudyGrid({ filters, initialPage, onClear }: CaseStudyGridProps) {
  const query = useCaseStudies({ ...filters, limit: initialPage.limit }, initialPage);
  const pages = query.data?.pages ?? [initialPage];
  const items = pages.flatMap((p) => p.items);
  const last = pages[pages.length - 1]!;

  if (items.length === 0) {
    return (
      <div role="status" className="flex flex-col items-start gap-4 rounded-md border border-rule bg-card p-6 md:p-10">
        <h2 className="text-h3">No events match these filters</h2>
        <p className="text-small text-slate">Try another city or year, or clear the filters to see all our work.</p>
        <Button variant="outline" onClick={onClear}>
          Clear filters
        </Button>
      </div>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-5 md:grid-cols-3 md:gap-x-6 md:gap-y-8">
        {items.map((study, index) => (
          <li key={study.id} className={cn(index < 2 && 'max-md:col-span-2')}>
            <CaseStudyCard study={study} compact={index >= 2} />
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col items-center gap-4 md:mt-14">
        {query.isFetchNextPageError && (
          <p role="alert" className="text-small text-destructive">
            Couldn&apos;t load more events. Check your connection and try again.
          </p>
        )}
        {query.hasNextPage && (
          <Button
            variant="outline"
            className="w-full md:w-auto"
            disabled={query.isFetchingNextPage}
            onClick={() => void query.fetchNextPage()}
          >
            {query.isFetchingNextPage && <Loader2 className="animate-spin" aria-hidden="true" />}
            {query.isFetchingNextPage ? 'Loading…' : 'Load more'}
          </Button>
        )}
        <p className="text-small text-slate" aria-live="polite">
          Showing {items.length} of {last.total}
        </p>
        {initialPage.pageCount > 1 && (
          <nav aria-label="Pages">
            <ul className="flex gap-1 text-[14px]">
              {Array.from({ length: initialPage.pageCount }, (_, i) => i + 1).map((page) => (
                <li key={page}>
                  <Link
                    href={galleryHref(filters, page)}
                    aria-current={page === initialPage.page ? 'page' : undefined}
                    className={cn(
                      'flex size-11 items-center justify-center text-ink hover:text-ink',
                      page === initialPage.page && 'font-semibold underline underline-offset-4',
                    )}
                  >
                    {page}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </>
  );
}
