import Image from 'next/image';
import type { CSSProperties } from 'react';
import type { ClientLogo } from '@brandviserproductions/contracts';
import { cn } from '@/lib/utils';

/** Grid of client logos; a labelled placeholder stands in for logos not uploaded yet. */
export function ClientLogos({ logos, columns = 6, className }: { logos: ClientLogo[]; columns?: 4 | 5 | 6; className?: string }) {
  if (logos.length === 0) return null;
  return (
    <ul
      className={cn(
        'grid grid-cols-3 gap-3 md:gap-6',
        { 4: 'md:grid-cols-4', 5: 'md:grid-cols-5', 6: 'md:grid-cols-6' }[columns],
        className,
      )}
    >
      {logos.slice(0, columns).map((logo) => (
        <li key={logo.id} className="relative flex h-12 items-center justify-center rounded-md bg-placeholder md:h-14">
          {logo.logoUrl ? (
            <Image src={logo.logoUrl} alt={logo.name} fill sizes="200px" quality={90} className="object-contain p-1" />
          ) : (
            <span className="eyebrow px-2 text-center text-slate">{logo.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}

/**
 * Every client logo on a slow, continuous scroll. The list is rendered twice (the copy hidden
 * from assistive tech) so the loop has no seam; it pauses on hover and, for reduced motion,
 * becomes a plain horizontally scrollable row. Logos load eagerly: lazy loading never fires for
 * images sliding in through the clipped track, which left blank slots in the loop.
 *
 * The logo files in /client-logos are optically sized (cropped tight left and right, with their
 * height balanced so wordmarks, marks and badges carry equal weight), so each one is shown at the
 * same height and its own width, with even gaps between them.
 */
export function ClientLogoMarquee({ logos, className }: { logos: ClientLogo[]; className?: string }) {
  if (logos.length === 0) return null;
  return (
    <div
      className={cn(
        'group overflow-hidden mask-x-from-90% mask-x-to-100% motion-reduce:overflow-x-auto',
        className,
      )}
    >
      <div
        className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none"
        style={{ '--marquee-duration': `${logos.length * 3}s` } as CSSProperties}
      >
        {[false, true].map((copy) => (
          <ul key={String(copy)} aria-hidden={copy || undefined} className={cn('flex flex-none', copy && 'motion-reduce:hidden')}>
            {logos.map((logo) => (
              <li key={logo.id} className="mx-5 flex h-11 flex-none items-center md:mx-8 md:h-14">
                {logo.logoUrl ? (
                  <Image
                    src={logo.logoUrl}
                    alt={copy ? '' : logo.name}
                    width={300}
                    height={100}
                    quality={90}
                    loading="eager"
                    className="h-full w-auto max-w-none"
                  />
                ) : (
                  <span className="eyebrow text-center text-slate">{logo.name}</span>
                )}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
