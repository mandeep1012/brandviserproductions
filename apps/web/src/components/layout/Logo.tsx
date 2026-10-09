import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** The navy and gold "B" from the BRANDVISER logo. Decorative: the wordmark beside it carries the name. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/b-mark-navy-gold.png"
      alt=""
      width={246}
      height={278}
      className={cn('h-7 w-auto shrink-0 md:h-9', className)}
    />
  );
}

/**
 * The logo lockup: B mark, BRANDVISER in navy (ivory on dark bands) and a gold tracked tagline
 * beneath, as in the logo artwork.
 */
export function Wordmark({ tagline = 'Productions', className }: { tagline?: string; className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5 md:gap-3', className)}>
      <BrandMark />
      <span className="flex flex-col gap-1">
        <span className="font-serif text-[22px] leading-none tracking-[0.03em] text-heading md:text-[28px]">
          BRANDVISER
        </span>
        <span className="text-[7px] leading-none font-medium tracking-[0.36em] text-gold-700 uppercase md:text-[8px] md:tracking-[0.38em] [.surface-dark_&]:text-gold-300">
          {tagline}
        </span>
      </span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="BRANDVISER Productions, home" className={cn('flex', className)}>
      <Wordmark />
    </Link>
  );
}
