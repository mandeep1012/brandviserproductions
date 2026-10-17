import Image from 'next/image';
import { Eyebrow } from '@/components/common/Eyebrow';

/** Where BRANDVISER has an international presence, in two rows as on the brand map artwork. */
const DESTINATIONS = [
  ['Dubai', 'Thailand', 'Singapore', 'Malaysia', 'Indonesia', 'Philippines', 'Sri Lanka', 'Maldives'],
  ['Hong Kong', 'Macao', 'Baku', 'Almaty', 'Türkiye', 'London', 'Mauritius'],
];

/** Contact: the world map with BRANDVISER's international destinations lit in gold, named underneath. */
export function GlobalPresence() {
  return (
    <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6 md:gap-8">
      <Eyebrow rule>Global presence</Eyebrow>
      <Image
        src="/contact/global-presence-map.jpg"
        alt="World map at night with BRANDVISER's international destinations lit in gold"
        width={1072}
        height={1011}
        sizes="(min-width: 48rem) 760px, 100vw"
        className="h-auto w-full rounded-md"
      />
      <div aria-hidden className="h-px w-4/5 bg-gold-500" />
      <div className="flex flex-col items-center gap-2 text-center text-[15px] text-navy md:text-[17px]">
        {DESTINATIONS.map((row) => (
          <ul key={row[0]} className="flex flex-wrap justify-center gap-x-3 gap-y-1">
            {row.map((name, index) => (
              <li key={name} className="flex items-center gap-3">
                {index > 0 && (
                  <span aria-hidden className="text-gold-500">
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
