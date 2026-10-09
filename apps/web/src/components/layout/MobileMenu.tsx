'use client';

import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ENQUIRY_HREF, isActive, PRIMARY_NAV } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { Wordmark } from './Logo';

export function MobileMenu() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Open menu"
          className="flex size-11 items-center justify-center text-navy lg:hidden"
        >
          <Menu className="size-5" strokeWidth={1.5} aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-sm border-rule bg-paper">
        <SheetHeader className="border-b border-rule">
          <SheetTitle className="font-normal">
            <Wordmark />
          </SheetTitle>
          <SheetDescription className="sr-only">Site navigation</SheetDescription>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul>
            {PRIMARY_NAV.map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} className="border-b border-rule">
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex min-h-14 items-center gap-3 text-lg text-ink hover:text-navy',
                      active && 'font-semibold text-navy before:h-5 before:w-0.5 before:bg-gold-500',
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Button asChild className="mt-6 w-full">
            <Link href={ENQUIRY_HREF} onClick={() => setOpen(false)}>
              Plan an event
            </Link>
          </Button>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
