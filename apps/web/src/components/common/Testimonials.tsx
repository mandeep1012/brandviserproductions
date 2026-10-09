'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { ClientLogo, Testimonial } from '@brandviserproductions/contracts';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 6000;

/**
 * Credits a quote to its company. Reviewer names were never published, so the company's logo
 * (matched by name against the client logos) stands in; its name is the fallback.
 */
export function TestimonialCompany({
  company,
  logos,
  className,
}: {
  company: string;
  logos: ClientLogo[];
  className?: string;
}) {
  const logoUrl = logos.find((logo) => logo.name === company)?.logoUrl;
  if (!logoUrl) return <p className={cn('font-semibold text-heading', className)}>{company}</p>;
  return (
    <div className={cn('relative h-8 w-32', className)}>
      <Image src={logoUrl} alt={company} fill sizes="144px" className="object-contain object-left" />
    </div>
  );
}

/**
 * A looping carousel: one card on mobile, two on tablet, three on desktop. It scroll-snaps, so it
 * swipes by touch; the arrows step one card and wrap at either end. It advances on its own unless
 * the reader is hovering, focused inside it, or prefers reduced motion.
 */
export function Testimonials({ testimonials, logos }: { testimonials: Testimonial[]; logos: ClientLogo[] }) {
  const track = useRef<HTMLUListElement>(null);
  const [paused, setPaused] = useState(false);

  const step = useCallback((direction: 1 | -1) => {
    const el = track.current;
    const card = el?.firstElementChild as HTMLElement | null;
    if (!el || !card) return;
    // Step by card index rather than by offset, so clicks made mid-scroll still land on a card.
    const pitch = card.offsetWidth + (parseFloat(getComputedStyle(el).columnGap) || 0);
    const last = Math.ceil((el.scrollWidth - el.clientWidth) / pitch - 0.05);
    const next = Math.round(el.scrollLeft / pitch) + direction;
    const index = next > last ? 0 : next < 0 ? last : next;
    el.scrollTo({ left: Math.min(index * pitch, el.scrollWidth - el.clientWidth), behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if (paused || testimonials.length < 2 || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const id = setInterval(() => {
      if (!document.hidden) step(1);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, step, testimonials.length]);

  if (testimonials.length === 0) return null;
  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      <ul
        ref={track}
        aria-label="Client testimonials"
        className="-mr-4 flex snap-x snap-mandatory gap-4 overflow-x-auto pr-4 pb-2 [scrollbar-width:none] md:mr-0 md:gap-6 md:pr-0 [&::-webkit-scrollbar]:hidden"
      >
        {testimonials.map((t) => (
          <li
            key={t.id}
            className="w-[85%] flex-none snap-start md:w-[calc((100%-1.5rem)/2)] lg:w-[calc((100%-3rem)/3)]"
          >
            <figure className="flex h-full flex-col gap-3 rounded-md border border-rule p-6 md:gap-4 md:p-8">
              <span aria-hidden="true" className="h-10 self-start font-serif text-[96px] leading-[0.9] italic text-metal md:h-12 md:text-[112px]">
                “
              </span>
              <blockquote className="min-h-28">{t.quote}</blockquote>
              <figcaption className="mt-auto border-t border-rule pt-4">
                <TestimonialCompany company={t.company} logos={logos} className="md:h-9 md:w-36" />
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>
      {testimonials.length > 1 && (
        <div className="mt-4 flex justify-end gap-2 md:mt-6">
          <Button variant="outline" size="icon-lg" aria-label="Previous testimonial" onClick={() => step(-1)}>
            <ChevronLeft />
          </Button>
          <Button variant="outline" size="icon-lg" aria-label="Next testimonial" onClick={() => step(1)}>
            <ChevronRight />
          </Button>
        </div>
      )}
    </div>
  );
}
