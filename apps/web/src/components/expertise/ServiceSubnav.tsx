'use client';

import { useEffect, useState } from 'react';
import type { Service } from '@brandviserproductions/contracts';
import { cn } from '@/lib/utils';

/**
 * Sticky jump links under the header. The link for the section currently in view is marked
 * with aria-current, using an IntersectionObserver band across the upper part of the viewport.
 */
export function ServiceSubnav({ services }: { services: Array<Pick<Service, 'slug' | 'name' | 'shortName'>> }) {
  const [active, setActive] = useState(services[0]?.slug);

  useEffect(() => {
    const sections = services
      .map((s) => document.getElementById(s.slug))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-140px 0px -55% 0px' },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [services]);

  return (
    <nav
      aria-label="Services"
      className="sticky top-14 z-30 border-y border-rule bg-paper md:bg-card lg:top-18"
    >
      <ul className="gutter flex gap-2 overflow-x-auto py-2.5 md:h-16 md:items-center md:gap-10 md:py-0">
        <li className="eyebrow hidden flex-none text-slate lg:block" aria-hidden="true">
          Jump to
        </li>
        {services.map((service) => {
          const current = active === service.slug;
          return (
            <li key={service.slug} className="flex-none">
              <a
                href={`#${service.slug}`}
                aria-current={current ? 'location' : undefined}
                className={cn(
                  // Mobile: chips. Desktop: underlined text links.
                  'flex min-h-11 items-center rounded-sm border border-rule bg-card px-4 text-[14px] font-medium text-ink hover:text-ink',
                  'md:min-h-0 md:rounded-none md:border-0 md:border-b-2 md:border-transparent md:bg-transparent md:px-0 md:py-1 md:text-[15px] md:font-normal',
                  current && 'border-navy text-navy md:border-gold-500',
                )}
              >
                <span className="md:hidden">{service.shortName}</span>
                <span className="hidden md:inline">{service.name}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
