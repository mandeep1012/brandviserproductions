import Link from 'next/link';
import type { Service, SiteInfo } from '@brandviserproductions/contracts';
import { isPlaceholder, mailHref, telHref } from '@/lib/contact-links';
import { COMPANY_NAV } from '@/lib/navigation';
import { GoldRule } from '@/components/common/Section';
import { Wordmark } from './Logo';

function ContactLines({ site }: { site: SiteInfo }) {
  return (
    <address className="not-italic">
      <p>{isPlaceholder(site.phone) ? site.phone : <a href={telHref(site.phone)}>{site.phone}</a>}</p>
      <p>{isPlaceholder(site.email) ? site.email : <a href={mailHref(site.email)}>{site.email}</a>}</p>
      <p>{site.address}</p>
    </address>
  );
}

const footerLink = 'text-ink hover:text-gold-300';

export function SiteFooter({ site, services }: { site: SiteInfo | null; services: Service[] }) {
  const expertise = services.map((s) => ({ href: `/expertise#${s.slug}`, label: s.name }));
  return (
    <>
    <GoldRule />
    <footer className="surface-dark gutter bg-midnight pt-10 pb-6 md:pt-16 md:pb-8 [&_a]:text-ink [&_a:hover]:text-gold-300">
      {/* Desktop: four columns */}
      <div className="hidden grid-cols-[2fr_1fr_1fr_1.5fr] gap-6 text-[15px] leading-7 md:grid">
        <div>
          <Wordmark tagline="Productions Pvt. Ltd." className="md:[&_img]:h-10" />
          {site && <p className="text-small mt-5 max-w-80 whitespace-pre-line text-slate">{site.description}</p>}
        </div>
        <nav aria-label="Expertise">
          <p className="eyebrow mb-3 text-eyebrow">Expertise</p>
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
          <p className="eyebrow mb-3 text-eyebrow">Company</p>
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
          <p className="eyebrow mb-3 text-eyebrow">Contact</p>
          {site && <ContactLines site={site} />}
        </div>
      </div>

      {/* Mobile: collapsible rows */}
      <div className="text-base md:hidden">
        <Wordmark tagline="Productions Pvt. Ltd." className="mb-4" />
        {site && <p className="text-small mb-6 whitespace-pre-line text-slate">{site.description}</p>}
        {[
          { title: 'Expertise', items: expertise },
          { title: 'Company', items: COMPANY_NAV },
        ].map((group) => (
          <details key={group.title} className="group border-t border-rule">
            <summary className="flex min-h-13 cursor-pointer list-none items-center justify-between">
              {group.title}
              <span aria-hidden="true" className="text-gold-500 group-open:hidden">
                +
              </span>
              <span aria-hidden="true" className="hidden text-gold-500 group-open:inline">
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
        <Link href="/gallery" className={`${footerLink} flex min-h-13 items-center border-t border-rule`}>
          Gallery
        </Link>
        {site && (
          <div className="border-t border-rule pt-4">
            <p className="eyebrow mb-2 text-eyebrow">Contact</p>
            <ContactLines site={site} />
          </div>
        )}
      </div>

      <p className="text-small mt-6 text-slate md:mt-10 md:border-t md:border-rule md:pt-4">
        © {new Date().getFullYear()} BRANDVISER Productions Pvt. Ltd. · <Link href="/privacy">Privacy</Link> ·{' '}
        <Link href="/terms">Terms</Link>
      </p>
    </footer>
    </>
  );
}
