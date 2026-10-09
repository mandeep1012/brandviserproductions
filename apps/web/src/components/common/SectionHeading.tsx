import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow } from './Eyebrow';

interface SectionHeadingProps {
  title: ReactNode;
  eyebrow?: string;
  link?: { href: string; label: string };
  as?: 'h1' | 'h2';
  className?: string;
}

/** Section title with an optional eyebrow above and a "See all →" link aligned right on desktop. */
export function SectionHeading({ title, eyebrow, link, as: Heading = 'h2', className }: SectionHeadingProps) {
  return (
    <div className={cn('mb-6 flex flex-col gap-3 md:mb-12 md:flex-row md:items-end md:justify-between', className)}>
      <div>
        {eyebrow && (
          <Eyebrow rule className="mb-2 md:mb-3">
            {eyebrow}
          </Eyebrow>
        )}
        <Heading className="text-h2">{title}</Heading>
      </div>
      {link && (
        <Link href={link.href} className="hidden text-[15px] md:inline">
          {link.label} →
        </Link>
      )}
    </div>
  );
}
