import Link from 'next/link';
import type { Service, SiteInfo } from '@brandviserproductions/contracts';
import { isPlaceholder, mailHref, telHref } from '@/lib/contact-links';
import { COMPANY_NAV } from '@/lib/navigation';

function ContactLines({ site }: { site: SiteInfo }) {
  return (
    <address className="not-italic">
      <p>{isPlaceholder(site.phone) ? site.phone : <a href={telHref(site.phone)}>{site.phone}</a>}</p>
      <p>{isPlaceholder(site.email) ? site.email : <a href={mailHref(site.email)}>{site.email}</a>}</p>
      <p>{site.address}</p>
    </address>
  );
}

const footerLink = 'text-paper hover:text-navy-muted';

export function SiteFooter({ site, services }: { site: SiteInfo | null; services: Service[] }) {
  const expertise = services.map((s) => ({ href: `/expertise#${s.slug}`, label: s.name }));
  return (
    <footer className="gutter bg-navy pt-10 pb-6 text-paper md:pt-16 md:pb-8 [&_a]:text-paper [&_a:hover]:text-navy-muted">
      {/* Desktop: four columns */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1.5fr] gap-6 text-[15px] leading-7 md:grid">
        <div>
          <p className="font-serif text-[28px] leading-none tracking-[0.02em]">BRANDVISER</p>
          {site && <p className="text-small mt-4 max-w-80 text-navy-muted">{site.description}</p>}
        </div>
        <nav aria-label="Expertise">
          <p className="eyebrow mb-3 text-navy-muted">Expertise</p>
          <ul>
            {expertise.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="eyebrow mb-3 text-navy-muted">Company</p>
          <ul>
            {COMPANY_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <p className="eyebrow mb-3 text-navy-muted">Contact</p>
          {site && <ContactLines site={site} />}
        </div>
      </div>

      {/* Mobile: collapsible rows */}
      <div className="text-base md:hidden">
        <p className="mb-6 font-serif text-[26px] leading-none tracking-[0.02em]">BRANDVISER</p>
        {[
          { title: 'Expertise', items: expertise },
          { title: 'Company', items: COMPANY_NAV },
        ].map((group) => (
          <details key={group.title} className="group border-t border-navy-rule">
            <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between">
              {group.title}
              <span aria-hidden="true" className="group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="hidden group-open:inline">
                −
              </span>
            </summary>
            <ul className="pb-3">
              {group.items.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={`${footerLink} flex min-h-11 items-center`}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
        <Link href="/gallery" className={`${footerLink} flex min-h-13 items-center border-t border-navy-rule`}>
          Gallery
        </Link>
        {site && (
          <div className="border-t border-navy-rule pt-4">
            <p className="eyebrow mb-2 text-navy-muted">Contact</p>
            <ContactLines site={site} />
          </div>
        )}
      </div>

      <p className="text-small mt-6 text-navy-muted md:mt-10 md:border-t md:border-navy-rule md:pt-4">
        © {new Date().getFullYear()} BRANDVISER · <Link href="/privacy">Privacy</Link> ·{' '}
        <Link href="/terms">Terms</Link>
      </p>
    </footer>
  );
}
