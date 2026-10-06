'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { isPlaceholder, telHref } from '@/lib/contact-links';
import { ENQUIRY_HREF } from '@/lib/navigation';

/** "Plan an event" everywhere except Contact, where the phone number takes its place. */
export function HeaderAction({ phone }: { phone: string | null }) {
  const pathname = usePathname();
  if (pathname === '/contact' && phone) {
    return isPlaceholder(phone) ? (
      <span className="eyebrow hidden text-slate lg:inline">{phone}</span>
    ) : (
      <a href={telHref(phone)} className="eyebrow hidden text-ink lg:inline">
        {phone}
      </a>
    );
  }
  return (
    <Button asChild className="hidden lg:inline-flex">
      <Link href={ENQUIRY_HREF}>Plan an event</Link>
    </Button>
  );
}
