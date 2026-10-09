'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Maximize2, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Moment } from '@/content/moments';
import { shuffle } from '@/lib/shuffle';
import { MomentsLightbox } from './MomentsLightbox';

const BATCH = 20;

/**
 * Tile spans, cycled by position. With `grid-flow-dense` these reproduce the wireframe's
 * mosaic exactly: 20 tiles fill 16 rows of the 12-column desktop grid, 14 tiles fill
 * 20 rows of the 4-column mobile grid. Full class names so Tailwind can see them.
 */
const DESKTOP = [
  'md:col-span-6 md:row-span-4',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-3',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-3',
  'md:col-span-3 md:row-span-4',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-4',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-3',
  'md:col-span-3 md:row-span-2',
  'md:col-span-6 md:row-span-4',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-3',
  'md:col-span-6 md:row-span-2',
  'md:col-span-3 md:row-span-4',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-2',
  'md:col-span-3 md:row-span-2',
];
const MOBILE = [
  'col-span-4 row-span-3',
  'col-span-2 row-span-3',
  'col-span-2 row-span-2',
  'col-span-2 row-span-2',
  'col-span-2 row-span-2',
  'col-span-2 row-span-3',
  'col-span-2 row-span-2',
  'col-span-4 row-span-3',
  'col-span-2 row-span-3',
  'col-span-2 row-span-2',
  'col-span-2 row-span-2',
  'col-span-2 row-span-2',
  'col-span-2 row-span-3',
  'col-span-2 row-span-2',
];

function tile(index: number) {
  const desktop = DESKTOP[index % DESKTOP.length]!;
  const mobile = MOBILE[index % MOBILE.length]!;
  const sizes = `(min-width: 48rem) ${desktop.includes('col-span-6') ? '50vw' : '25vw'}, ${
    mobile.includes('col-span-4') ? '100vw' : '50vw'
  }`;
  return { className: `${mobile} ${desktop}`, sizes };
}

interface MomentsMosaicProps {
  photos: Moment[];
  /** The page heading, shown left of the count and Shuffle. */
  children: ReactNode;
}

/** Photo-only mosaic: shuffle, batches of 20 that load as you scroll, full-screen lightbox. */
export function MomentsMosaic({ photos, children }: MomentsMosaicProps) {
  const [order, setOrder] = useState(photos);
  const [visible, setVisible] = useState(BATCH);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const hasMore = visible < order.length;

  // Load the next batch before the reader reaches the end. Re-observing after each batch
  // fires again if the sentinel is still in range.
  useEffect(() => {
    const target = sentinel.current;
    if (!target || !hasMore) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setVisible((count) => count + BATCH);
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [visible, hasMore]);

  return (
    <>
      <section className="flex items-end justify-between gap-3 px-4 pt-7 pb-5 md:px-8 md:pt-14 md:pb-8">
        <div>{children}</div>
        <div className="flex items-center gap-6">
          <p className="text-small hidden text-slate md:block">{order.length} photographs</p>
          <Button
            variant="outline"
            onClick={() => setOrder((current) => shuffle(current))}
            aria-label="Shuffle photos"
            className="size-12 px-0 md:size-auto md:px-6"
          >
            <Shuffle aria-hidden="true" className="size-5 md:size-[18px]" />
            <span className="hidden md:inline">Shuffle</span>
          </Button>
        </div>
      </section>

      <section
        aria-label="Event photographs"
        className="grid grid-flow-dense auto-rows-[90px] grid-cols-4 gap-1.5 px-1.5 md:auto-rows-[110px] md:grid-cols-12 md:gap-2 md:px-2"
      >
        {order.slice(0, visible).map((photo, index) => {
          const { className, sizes } = tile(index);
          return (
            <button
              key={photo.src}
              type="button"
              onClick={() => setOpenIndex(index)}
              aria-label={`Open photo ${index + 1} of ${order.length}`}
              // The blur sits on the tile, not the image, so it still shows while a shuffled
              // photo loads at its new size.
              style={{ backgroundImage: `url(${photo.blurDataURL})` }}
              className={`group relative overflow-hidden rounded-sm bg-placeholder bg-cover bg-center outline-none ${className}`}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes={sizes}
                preload={index < 4}
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02] group-focus-visible:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-2 rounded-sm opacity-0 outline-2 outline-gold-500 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute top-3 right-3 flex size-8 items-center justify-center rounded-sm bg-midnight/70 text-gold-300 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
              >
                <Maximize2 className="size-4" />
              </span>
            </button>
          );
        })}
      </section>

      <div className="flex flex-col items-center px-4 pt-8 pb-12 md:px-8 md:pt-12 md:pb-14">
        {hasMore && (
          <>
            <div ref={sentinel} aria-hidden="true" />
            <Button variant="outline" onClick={() => setVisible((count) => count + BATCH)} className="w-full md:w-auto">
              More moments
            </Button>
          </>
        )}
      </div>

      <MomentsLightbox
        photos={order}
        index={openIndex}
        onIndexChange={setOpenIndex}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
