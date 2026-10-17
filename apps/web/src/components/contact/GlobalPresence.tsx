import Image from 'next/image';
import { Eyebrow } from '@/components/common/Eyebrow';

/** Where BRANDVISER has an international presence, in two rows as on the brand map artwork. */
const DESTINATIONS = [
  ['Dubai', 'Thailand', 'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Sri Lanka', 'Maldives'],
  ['Hong Kong', 'Macao', 'Baku', 'Almaty', 'Türkiye', 'London', 'Mauritius'],
];

/**
 * Contact: the world map with BRANDVISER's international destinations lit in gold, named underneath.
 * Desktop shows the names in exactly two rows; tablets and phones show a neat grid instead of
 * wrapped rows (which would start lines with a stray separator).
 */
export function GlobalPresence() {
  return (
    <div className="mx-auto flex max-w-[960px] flex-col items-center gap-6 md:gap-8">
      <Eyebrow rule>Global presence</Eyebrow>
      <Image
        src="/contact/global-presence-map.jpg"
        alt="World map at night with BRANDVISER's international destinations lit in gold"
        width={1072}
        height={1011}
        sizes="(min-width: 48rem) 760px, 100vw"
        className="h-auto w-full max-w-[760px] rounded-md"
      />
      <div aria-hidden className="h-px w-full max-w-[608px] bg-gold-500" />
      <div className="grid w-full grid-cols-3 gap-x-2 gap-y-2.5 text-center text-[15px] text-navy md:grid-cols-5 md:text-base lg:flex lg:flex-col lg:items-center lg:gap-2 lg:text-[17px]">
        {DESTINATIONS.map((row) => (
          <ul key={row[0]} className="contents lg:flex lg:justify-center lg:gap-x-3">
            {row.map((name, index) => (
              <li key={name} className="lg:flex lg:items-center lg:gap-3 lg:whitespace-nowrap">
                {index > 0 && (
                  <span aria-hidden className="hidden text-gold-500 lg:inline">
                    •
                  </span>
                )}
                {name}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
