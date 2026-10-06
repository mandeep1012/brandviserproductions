import Image from 'next/image';
import { cn } from '@/lib/utils';

interface EventImageProps {
  src: string | null | undefined;
  alt: string;
  /** Shown in the placeholder box when there is no image yet. */
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * A photograph in a sized box (the caller sets height or aspect ratio). Without a source it
 * renders the wireframe's labelled placeholder, so missing client photography is obvious.
 */
export function EventImage({ src, alt, label, className, sizes = '100vw', priority = false }: EventImageProps) {
  if (!src) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={cn(
          'eyebrow flex items-center justify-center rounded-md bg-placeholder p-4 text-center text-slate',
          className,
        )}
      >
        {label ?? alt}
      </div>
    );
  }
  return (
    <div className={cn('relative overflow-hidden rounded-md bg-placeholder', className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
