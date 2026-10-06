import Link from 'next/link';
import type { Service } from '@brandviserproductions/contracts';
import { EventImage } from '@/components/common/EventImage';
import { Button } from '@/components/ui/button';

/** One practice: photo, number, name, description, deliverables, and two next steps. */
export function ServiceSection({ service }: { service: Service }) {
  const headingId = `${service.slug}-heading`;
  return (
    <section
      id={service.slug}
      aria-labelledby={headingId}
      className="gutter grid gap-3 border-b border-rule py-10 md:grid-cols-2 md:items-center md:gap-16 md:py-20"
    >
      <EventImage
        src={service.imageUrl}
        alt={`${service.name} work by BRANDVISER`}
        label={`${service.name} · photograph`}
        sizes="(min-width: 48rem) 50vw, 100vw"
        className="aspect-video md:aspect-auto md:h-100"
      />
      <div className="flex flex-col gap-3 md:gap-4">
        <span className="mt-2 font-serif text-[30px] leading-9 text-brass md:mt-0 md:text-[40px] md:leading-[46px]">
          {service.number}
        </span>
        <h2 id={headingId} className="text-h2">
          {service.name}
        </h2>
        <p>{service.description}</p>

        {/* Desktop: two-column list. Mobile: collapsed behind "What we deliver". */}
        <p className="eyebrow mt-2 hidden text-slate md:block">What we deliver</p>
        <ul className="hidden grid-cols-2 gap-x-6 gap-y-1 text-[15px] md:grid">
          {service.deliverables.map((item) => (
            <li key={item} className="border-t border-rule py-1.5">
              {item}
            </li>
          ))}
        </ul>
        <details className="group border-y border-rule md:hidden">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between font-semibold">
            What we deliver
            <span aria-hidden="true" className="group-open:hidden">
              +
            </span>
            <span aria-hidden="true" className="hidden group-open:inline">
              −
            </span>
          </summary>
          <p className="text-small pb-3 text-slate">{service.deliverables.join(' · ')}</p>
        </details>

        <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <Button asChild variant="outline">
            <Link href={`/gallery?service=${service.slug}`}>See {service.shortName} work</Link>
          </Button>
          <Link href={`/contact?service=${service.slug}#enquiry`} className="flex min-h-12 items-center justify-center text-base">
            Enquire →
          </Link>
        </div>
      </div>
    </section>
  );
}
