import Link from 'next/link';
import type { SiteInfo } from '@brandviserproductions/contracts';
import { isPlaceholder, telHref, whatsappHref } from '@/lib/contact-links';
import { ENQUIRY_HREF } from '@/lib/navigation';

const item = 'flex min-h-12 flex-1 items-center justify-center text-[15px] font-medium text-ink hover:text-ink';

/** Sticky Call / WhatsApp / Enquire bar on phones. */
export function MobileContactBar({ site }: { site: SiteInfo | null }) {
  const phone = site && !isPlaceholder(site.phone) ? telHref(site.phone) : '/contact';
  const whatsapp = site && !isPlaceholder(site.whatsapp) ? whatsappHref(site.whatsapp) : '/contact';
  return (
    <nav
      aria-label="Quick contact"
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-rule bg-card p-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] md:hidden"
    >
      <a href={phone} className={item}>
        Call
      </a>
      <a href={whatsapp} className={`${item} border-x border-rule`} target="_blank" rel="noopener noreferrer">
        WhatsApp
      </a>
      <Link href={ENQUIRY_HREF} className={`${item} text-signal hover:text-signal-hover`}>
        Enquire
      </Link>
    </nav>
  );
}
