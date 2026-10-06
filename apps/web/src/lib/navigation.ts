export interface NavItem {
  href: string;
  label: string;
}

export const PRIMARY_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/expertise', label: 'Our Expertise' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/about', label: 'About & Process' },
  { href: '/contact', label: 'Contact' },
];

export const COMPANY_NAV: NavItem[] = [
  { href: '/about', label: 'About' },
  { href: '/about#process', label: 'Process' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/contact', label: 'Contact' },
];

export const ENQUIRY_HREF = '/contact#enquiry';

/** True when `pathname` is the nav item's page or one of its children. */
export function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
