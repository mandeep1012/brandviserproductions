import Link from 'next/link';
import type { Service } from '@brandviserproductions/contracts';

/** Four cards on desktop; numbered rows on mobile. Each links to its section on Our Expertise. */
export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <>
      <ul className="hidden gap-6 md:grid md:grid-cols-2 lg:grid-cols-4">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              href={`/expertise#${service.slug}`}
              className="group gold-edge flex h-full min-h-75 flex-col gap-3 rounded-md border border-rule bg-card p-6 text-ink transition-colors hover:border-gold-500 hover:text-ink"
            >
              <span className="eyebrow text-gold-700">{service.number}</span>
              <h3 className="text-h3">{service.name}</h3>
              <p className="text-small text-slate">{service.line}</p>
              <span className="mt-auto text-[15px] text-link group-hover:text-link-hover">Explore →</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="border-t border-rule md:hidden">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              href={`/expertise#${service.slug}`}
              className="flex min-h-16 items-center justify-between border-b border-rule text-heading hover:text-heading"
            >
              <span>
                <span className="eyebrow mr-3 text-gold-700">{service.number}</span>
                <span className="font-semibold">{service.name}</span>
              </span>
              <span aria-hidden="true" className="text-gold-500">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
