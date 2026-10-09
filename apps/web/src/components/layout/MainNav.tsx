'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isActive, PRIMARY_NAV } from '@/lib/navigation';
import { cn } from '@/lib/utils';

export function MainNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex gap-8 text-[15px]">
        {PRIMARY_NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'border-b-2 border-transparent py-1 text-ink hover:border-rule hover:text-navy',
                  active && 'border-gold-500 text-navy hover:border-gold-500',
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
