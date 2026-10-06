import Link from 'next/link';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={cn(
        'font-serif text-2xl leading-none tracking-[0.02em] text-ink hover:text-ink md:text-[28px]',
        className,
      )}
    >
      BRANDVISER
    </Link>
  );
}
