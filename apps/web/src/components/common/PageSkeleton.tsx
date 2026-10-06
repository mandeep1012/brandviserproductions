import { Skeleton } from '@/components/ui/skeleton';

/** Route-level loading state shaped like a page intro followed by a card grid. */
export function PageSkeleton({ hero = 'split', cards = 3 }: { hero?: 'split' | 'stacked'; cards?: number }) {
  return (
    <div aria-busy="true" aria-live="polite" className="gutter py-12 md:py-20">
      <span className="sr-only">Loading…</span>
      <div className={hero === 'split' ? 'grid gap-8 md:grid-cols-12' : 'flex flex-col gap-6'}>
        <div className="flex flex-col gap-4 md:col-span-7">
          <Skeleton className="h-4 w-40 bg-placeholder" />
          <Skeleton className="h-12 w-full max-w-xl bg-placeholder md:h-16" />
          <Skeleton className="h-12 w-3/4 max-w-lg bg-placeholder md:h-16" />
          <Skeleton className="h-5 w-full max-w-md bg-placeholder" />
        </div>
        {hero === 'split' && <Skeleton className="h-64 bg-placeholder md:col-span-5 md:h-96" />}
      </div>
      <div className="mt-16 grid gap-6 md:grid-cols-3">
        {Array.from({ length: cards }, (_, i) => (
          <div key={i} className="flex flex-col gap-3">
            <Skeleton className="aspect-[4/3] bg-placeholder" />
            <Skeleton className="h-6 w-2/3 bg-placeholder" />
            <Skeleton className="h-4 w-1/3 bg-placeholder" />
          </div>
        ))}
      </div>
    </div>
  );
}
