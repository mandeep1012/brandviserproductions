import Link from 'next/link';
import type { Service } from '@brandviserproductions/contracts';

/** Five cards on desktop; numbered rows on mobile. Each links to its section on Our Expertise. */
export function ServiceCards({ services }: { services: Service[] }) {
  return (
    <>
      <ul className="hidden gap-6 md:grid md:grid-cols-3 lg:grid-cols-5">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              href={`/expertise#${service.slug}`}
              className="group flex h-full min-h-75 flex-col gap-3 rounded-md border border-rule bg-card p-6 text-ink transition-colors hover:border-ink hover:text-ink"
            >
              <span className="eyebrow text-slate">{service.number}</span>
              <h3 className="text-h3">{service.name}</h3>
              <p className="text-small text-slate">{service.line}</p>
              <span className="mt-auto text-[15px] text-signal group-hover:text-signal-hover">Explore →</span>
            </Link>
          </li>
        ))}
      </ul>
      <ul className="border-t border-rule md:hidden">
        {services.map((service) => (
          <li key={service.id}>
            <Link
              href={`/expertise#${service.slug}`}
              className="flex min-h-16 items-center justify-between border-b border-rule text-ink hover:text-ink"
            >
              <span>
                <span className="eyebrow mr-3 text-slate">{service.number}</span>
                <span className="font-semibold">{service.name}</span>
              </span>
              <span aria-hidden="true" className="text-signal">
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
