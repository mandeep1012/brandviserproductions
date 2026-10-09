'use client';

import Image from 'next/image';
import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogTitle } from '@/components/ui/dialog';
import type { Moment } from '@/content/moments';

const SWIPE = 50;
const SWIPE_CLOSE = 80;

interface MomentsLightboxProps {
  photos: Moment[];
  /** Open photo, or null when closed. */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

const roundButton =
  'flex size-12 items-center justify-center rounded-full bg-gold-500 bg-[image:var(--gold-fill)] text-midnight outline-none hover:brightness-105 focus-visible:ring-[3px] focus-visible:ring-gold-300/60';

/**
 * Full-screen photo viewer with no captions. Arrows or swipe to move (wrapping at either
 * end), Esc or swipe down to close.
 */
export function MomentsLightbox({ photos, index, onIndexChange, onClose }: MomentsLightboxProps) {
  const start = useRef<{ x: number; y: number } | null>(null);
  const count = photos.length;
  const current = index === null ? null : photos[index];

  const go = (step: number) => {
    if (index !== null) onIndexChange((index + step + count) % count);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') go(-1);
    else if (event.key === 'ArrowRight') go(1);
    else return;
    event.preventDefault();
  };

  const onPointerDown = (event: PointerEvent) => {
    start.current = { x: event.clientX, y: event.clientY };
  };

  const onPointerUp = (event: PointerEvent) => {
    if (!start.current) return;
    const dx = event.clientX - start.current.x;
    const dy = event.clientY - start.current.y;
    start.current = null;
    if (Math.abs(dx) > SWIPE && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > SWIPE_CLOSE) onClose();
  };

  // The neighbours load alongside the open photo so moving to them is instant.
  const stack =
    index === null
      ? []
      : [...new Set([index, (index + 1) % count, (index - 1 + count) % count])].map((i) => ({ i, photo: photos[i]! }));

  return (
    <Dialog open={current !== null} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        onKeyDown={onKeyDown}
        className="surface-dark top-0 left-0 flex h-dvh w-screen max-w-none translate-x-0 translate-y-0 flex-col gap-0 rounded-none border-0 bg-midnight/95 p-0 text-ink shadow-none data-[state=closed]:zoom-out-100 data-[state=open]:zoom-in-100 sm:max-w-none"
      >
        <DialogTitle className="sr-only">Event photograph</DialogTitle>

        <div className="flex items-center justify-between px-4 py-2 md:px-8 md:py-4">
          <p className="eyebrow text-gold-300" aria-live="polite">
            {index !== null && `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`}
          </p>
          <DialogClose
            aria-label="Close"
            className="flex size-12 items-center justify-center rounded-full text-gold-100 outline-none hover:bg-white/10 focus-visible:ring-[3px] focus-visible:ring-gold-300/60"
          >
            <X className="size-6" />
          </DialogClose>
        </div>

        <div className="relative flex min-h-0 flex-1 items-center gap-6 px-2 pb-6 md:px-8 md:pb-10">
          <button type="button" aria-label="Previous photo" onClick={() => go(-1)} className={`${roundButton} hidden shrink-0 md:flex`}>
            <ChevronLeft className="size-6" />
          </button>

          <div
            className="relative h-full flex-1 touch-none select-none"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => {
              start.current = null;
            }}
          >
            {stack.map(({ i, photo }) => (
              <Image
                key={photo.src}
                src={photo.src}
                alt={i === index ? `BRANDVISER event photograph ${i + 1} of ${count}` : ''}
                aria-hidden={i !== index}
                fill
                sizes="100vw"
                loading="eager"
                draggable={false}
                placeholder="blur"
                blurDataURL={photo.blurDataURL}
                className={`object-contain transition-opacity duration-300 motion-reduce:transition-none ${
                  i === index ? 'opacity-100' : 'pointer-events-none opacity-0'
                }`}
              />
            ))}
          </div>

          <button type="button" aria-label="Next photo" onClick={() => go(1)} className={`${roundButton} hidden shrink-0 md:flex`}>
            <ChevronRight className="size-6" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
