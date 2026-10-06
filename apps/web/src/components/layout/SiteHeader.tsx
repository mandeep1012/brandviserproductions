import { Phone } from 'lucide-react';
import Link from 'next/link';
import { isPlaceholder, telHref } from '@/lib/contact-links';
import { HeaderAction } from './HeaderAction';
import { Logo } from './Logo';
import { MainNav } from './MainNav';
import { MobileMenu } from './MobileMenu';

export function SiteHeader({ phone }: { phone: string | null }) {
  const callHref = phone && !isPlaceholder(phone) ? telHref(phone) : '/contact';
  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper/95 backdrop-blur supports-[backdrop-filter]:bg-paper/85">
      <div className="flex h-14 items-center justify-between pr-2 pl-4 lg:gutter lg:h-18">
        <Logo />
        <MainNav />
        <HeaderAction phone={phone} />
        <div className="flex lg:hidden">
          <Link
            href={callHref}
            aria-label="Call us"
            className="flex size-11 items-center justify-center text-ink hover:text-ink"
          >
            <Phone className="size-5" strokeWidth={1.5} aria-hidden="true" />
          </Link>
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}
