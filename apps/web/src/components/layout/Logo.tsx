import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

/** The "B" from the BRANDVISER logo. Decorative: the wordmark beside it carries the name. */
export function BrandMark({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/b-mark.png"
      alt=""
      width={113}
      height={128}
      className={cn('h-7 w-auto shrink-0 md:h-8', className)}
    />
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'flex items-center gap-2.5 font-serif text-2xl leading-none tracking-[0.02em] text-ink hover:text-ink md:text-[28px]',
        className,
      )}
    >
      <BrandMark />
      BRANDVISER
    </Link>
  );
}
