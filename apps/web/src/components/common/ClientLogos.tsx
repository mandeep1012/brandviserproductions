import Image from 'next/image';
import type { ClientLogo } from '@brandviserproductions/contracts';
import { cn } from '@/lib/utils';

/** Grid of client logos; a labelled placeholder stands in for logos not uploaded yet. */
export function ClientLogos({ logos, columns = 6, className }: { logos: ClientLogo[]; columns?: 4 | 6; className?: string }) {
  if (logos.length === 0) return null;
  return (
    <ul
      className={cn(
        'grid grid-cols-3 gap-3 md:gap-6',
        columns === 6 ? 'md:grid-cols-6' : 'md:grid-cols-4',
        className,
      )}
    >
      {logos.slice(0, columns).map((logo) => (
        <li key={logo.id} className="relative flex h-12 items-center justify-center rounded-md bg-placeholder md:h-14">
          {logo.logoUrl ? (
            <Image src={logo.logoUrl} alt={logo.name} fill sizes="200px" className="object-contain p-2" />
          ) : (
            <span className="eyebrow px-2 text-center text-slate">{logo.name}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
