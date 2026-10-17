import type { SiteInfo } from '@brandviserproductions/contracts';
import { Button } from '@/components/ui/button';
import { hasValue, mailHref, sameNumber, telHref, whatsappHref } from '@/lib/contact-links';

/**
 * Phone, WhatsApp and email as links. When WhatsApp is the same number as the phone, the two share one
 * line ("+91 … · Call or WhatsApp"). Unconfirmed (placeholder) lines are left out rather than shown.
 */
export function DirectLines({ site }: { site: SiteInfo }) {
  const hasPhone = hasValue(site.phone);
  const hasWhatsapp = hasValue(site.whatsapp);
  const shared = hasPhone && hasWhatsapp && sameNumber(site.phone, site.whatsapp);
  if (!hasPhone && !hasWhatsapp && !hasValue(site.email)) return null;
  return (
    <div className="border-t border-rule pt-5">
      <p className="eyebrow mb-2 text-slate">Direct lines</p>
      {hasPhone && (
        <p>
          <a href={telHref(site.phone)}>{site.phone}</a>
          {shared && (
            <span className="text-small text-slate">
              {' · '}Call or <a href={whatsappHref(site.whatsapp)}>WhatsApp</a>
            </span>
          )}
        </p>
      )}
      {hasWhatsapp && !shared && (
        <p>
          <a href={whatsappHref(site.whatsapp)}>WhatsApp {site.whatsapp}</a>
        </p>
      )}
      {hasValue(site.email) && (
        <p>
          <a href={mailHref(site.email)}>{site.email}</a>
        </p>
      )}
    </div>
  );
}

export function Office({ site }: { site: SiteInfo }) {
  return (
    <div className="border-t border-rule pt-5">
      <p className="eyebrow mb-2 text-slate">Office</p>
      <address className="not-italic">{site.address}</address>
      {hasValue(site.hours) && <p className="text-small text-slate">{site.hours}</p>}
    </div>
  );
}

/** Mobile: three equal buttons under the page title. */
export function QuickContactButtons({ site }: { site: SiteInfo }) {
  const items = [
    { label: 'Call', href: telHref(site.phone), value: site.phone },
    { label: 'WhatsApp', href: whatsappHref(site.whatsapp), value: site.whatsapp },
    { label: 'Email', href: mailHref(site.email), value: site.email },
  ].filter((item) => hasValue(item.value));
  if (items.length === 0) return null;
  return (
    <div className="mt-3 grid grid-cols-3 gap-2 md:hidden">
      {items.map((item) => (
        <Button key={item.label} asChild variant="outline" className="px-2">
          <a href={item.href}>{item.label}</a>
        </Button>
      ))}
    </div>
  );
}

export const NEXT_STEPS = [
  'We call to understand the brief',
  'We meet, in person or online',
  'You receive a concept and estimate',
];

export function NextSteps({ variant }: { variant: 'compact' | 'rows' }) {
  if (variant === 'compact') {
    return (
      <div className="border-t border-rule pt-5">
        <p className="eyebrow mb-3 text-slate">What happens next</p>
        <ol className="flex flex-col gap-2 text-[15px]">
          {NEXT_STEPS.map((step, index) => (
            <li key={step}>
              <span className="eyebrow mr-3 text-slate">{String(index + 1).padStart(2, '0')}</span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    );
  }
  return (
    <ol>
      {NEXT_STEPS.map((step, index) => (
        <li key={step} className="flex min-h-14 items-center gap-4 border-t border-rule last:border-b">
          <span className="eyebrow text-slate">{String(index + 1).padStart(2, '0')}</span>
          {step}
        </li>
      ))}
    </ol>
  );
}
