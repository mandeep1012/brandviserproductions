import type { SiteInfo } from '@brandviserproductions/contracts';
import { Button } from '@/components/ui/button';
import { hasValue, mailHref, telHref, whatsappHref } from '@/lib/contact-links';

/** Phone, WhatsApp and email as links. Unconfirmed (placeholder) lines are left out rather than shown. */
export function DirectLines({ site }: { site: SiteInfo }) {
  const lines = [
    { key: 'phone', value: site.phone, href: telHref(site.phone), label: site.phone },
    { key: 'whatsapp', value: site.whatsapp, href: whatsappHref(site.whatsapp), label: `WhatsApp ${site.whatsapp}` },
    { key: 'email', value: site.email, href: mailHref(site.email), label: site.email },
  ].filter((line) => hasValue(line.value));
  if (lines.length === 0) return null;
  return (
    <div className="border-t border-rule pt-5">
      <p className="eyebrow mb-2 text-slate">Direct lines</p>
      {lines.map((line) => (
        <p key={line.key}>
          <a href={line.href}>{line.label}</a>
        </p>
      ))}
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
