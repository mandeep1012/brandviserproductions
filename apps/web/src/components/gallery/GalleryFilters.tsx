'use client';

import { SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import type { CaseStudyFacets } from '@brandviserproductions/contracts';
import { OptionSelect } from '@/components/common/OptionSelect';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { galleryHref, type GalleryFilters as Filters } from '@/lib/gallery';
import { EVENT_TYPE_TABS } from '@/lib/labels';
import { cn } from '@/lib/utils';

const ALL = 'all';

interface GalleryFiltersProps {
  facets: CaseStudyFacets;
  filters: Filters;
  onNavigate: (href: string) => void;
}

function useOptions(facets: CaseStudyFacets) {
  return {
    service: [{ value: ALL, label: 'All services' }, ...facets.services.map((s) => ({ value: s.slug, label: s.shortName }))],
    city: [{ value: ALL, label: 'All cities' }, ...facets.cities.map((c) => ({ value: c, label: c }))],
    year: [{ value: ALL, label: 'Any year' }, ...facets.years.map((y) => ({ value: String(y), label: String(y) }))],
  };
}

function withSelect(filters: Filters, key: 'service' | 'city' | 'year', value: string): Filters {
  const next = { ...filters };
  if (value === ALL) delete next[key];
  else if (key === 'year') next.year = Number(value);
  else next[key] = value;
  return next;
}

/**
 * Desktop: event-type tabs plus Service / City / Year selects. Mobile: type chips plus a
 * "Filters" sheet. Every change is a URL change, so filtered views can be shared and indexed.
 */
export function GalleryFilters({ facets, filters, onNavigate }: GalleryFiltersProps) {
  const options = useOptions(facets);
  const tabs = [{ value: undefined, label: 'All' }, ...EVENT_TYPE_TABS];
  const selectFilters = (['service', 'city', 'year'] as const).filter((key) => filters[key] !== undefined).length;

  return (
    <div className="border-y border-rule bg-card">
      {/* Desktop */}
      <div className="gutter hidden h-18 items-center justify-between lg:flex">
        <nav aria-label="Event type">
          <ul className="flex gap-7">
            {tabs.map((tab) => {
              const current = filters.type === tab.value;
              return (
                <li key={tab.label}>
                  <Link
                    href={galleryHref({ ...filters, type: tab.value })}
                    scroll={false}
                    onClick={(e) => {
                      e.preventDefault();
                      onNavigate(galleryHref({ ...filters, type: tab.value }));
                    }}
                    aria-current={current ? 'page' : undefined}
                    className={cn(
                      'flex h-18 items-center border-b-2 border-transparent text-[15px] text-ink hover:text-ink',
                      current && 'border-signal font-semibold',
                    )}
                  >
                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="flex gap-3">
          {(['service', 'city', 'year'] as const).map((key) => (
            <div key={key} className="w-44">
              <OptionSelect
                id={`filter-${key}`}
                aria-label={key === 'service' ? 'Service' : key === 'city' ? 'City' : 'Year'}
                value={filters[key] !== undefined ? String(filters[key]) : ALL}
                onChange={(value) => onNavigate(galleryHref(withSelect(filters, key, value)))}
                options={options[key]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex gap-2 overflow-x-auto py-2.5 pr-4 pl-4 lg:hidden">
        <MobileFilterSheet facets={facets} filters={filters} onNavigate={onNavigate} activeCount={selectFilters} />
        {tabs.map((tab) => {
          const current = filters.type === tab.value;
          return (
            <Link
              key={tab.label}
              href={galleryHref({ ...filters, type: tab.value })}
              scroll={false}
              onClick={(e) => {
                e.preventDefault();
                onNavigate(galleryHref({ ...filters, type: tab.value }));
              }}
              aria-current={current ? 'page' : undefined}
              className={cn(
                'flex min-h-11 flex-none items-center rounded-sm border border-rule bg-card px-4 text-[14px] font-medium text-ink hover:text-ink',
                current && 'border-ink bg-ink text-paper hover:text-paper',
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function MobileFilterSheet({
  facets,
  filters,
  onNavigate,
  activeCount,
}: GalleryFiltersProps & { activeCount: number }) {
  const options = useOptions(facets);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Filters>(filters);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (next) setDraft(filters);
        setOpen(next);
      }}
    >
      <SheetTrigger asChild>
        <button
          type="button"
          className="flex min-h-11 flex-none items-center gap-2 rounded-sm border border-ink bg-card px-4 text-[14px] font-medium text-ink"
        >
          <SlidersHorizontal className="size-4" aria-hidden="true" />
          Filters{activeCount > 0 && ` (${activeCount})`}
        </button>
      </SheetTrigger>
      <SheetContent side="bottom" className="rounded-t-lg border-rule bg-paper">
        <SheetHeader>
          <SheetTitle className="text-h3">Filter the gallery</SheetTitle>
          <SheetDescription className="sr-only">Choose a service, city or year</SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 px-4">
          {(['service', 'city', 'year'] as const).map((key) => (
            <div key={key}>
              <Label htmlFor={`sheet-${key}`} className="mb-2 text-[14px] font-normal">
                {key === 'service' ? 'Service' : key === 'city' ? 'City' : 'Year'}
              </Label>
              <OptionSelect
                id={`sheet-${key}`}
                value={draft[key] !== undefined ? String(draft[key]) : ALL}
                onChange={(value) => setDraft((d) => withSelect(d, key, value))}
                options={options[key]}
              />
            </div>
          ))}
        </div>
        <SheetFooter className="flex-row gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setOpen(false);
              onNavigate(galleryHref({ type: filters.type }));
            }}
          >
            Clear
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              setOpen(false);
              onNavigate(galleryHref({ ...draft, type: filters.type }));
            }}
          >
            Show results
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
