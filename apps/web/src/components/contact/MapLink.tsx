import Image from 'next/image';
import { cn } from '@/lib/utils';

/** A static map image linking out to Google Maps. No embedded map, so nothing heavy loads. */
export function MapLink({ mapUrl, imageUrl, address, className }: { mapUrl: string; imageUrl: string | null; address: string; className?: string }) {
  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'eyebrow relative flex h-80 items-center justify-center overflow-hidden rounded-md bg-placeholder text-slate hover:text-ink',
        className,
      )}
    >
      {imageUrl ? (
        <Image src={imageUrl} alt={`Map showing ${address}`} fill sizes="100vw" className="object-cover" />
      ) : (
        <span>Open our office in Google Maps</span>
      )}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
