import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Intrinsic size of the logo artwork in /public/brand (4x its largest use on the site). */
const LOGO_WIDTH = 1200;
const LOGO_HEIGHT = 248;

/**
 * The BRANDVISER logo artwork: B mark, BRANDVISER and the gold "Productions Pvt. Ltd." line,
 * exactly as designed. `tone="dark"` is the same artwork with ivory lettering for navy bands.
 * Set the height with a class; the width follows. Served at high quality so the lettering stays sharp.
 */
export function Wordmark({
  tone = 'light',
  priority = false,
  className,
}: {
  tone?: 'light' | 'dark';
  priority?: boolean;
  className?: string;
}) {
  return (
    <Image
      src={tone === 'dark' ? '/brand/brandviser-logo-reversed.png' : '/brand/brandviser-logo.png'}
      alt="BRANDVISER Productions Pvt. Ltd."
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      quality={90}
      sizes="320px"
      priority={priority}
      className={cn('h-10 w-auto max-w-none shrink-0', className)}
    />
  );
}

/** Header logo, linking home. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" aria-label="BRANDVISER Productions, home" className={cn('flex shrink-0', className)}>
      <Wordmark priority className="h-10 sm:h-11 lg:h-12 xl:h-14" />
    </Link>
  );
}
