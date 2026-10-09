import { Analytics } from '@vercel/analytics/next';
import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono, Instrument_Serif } from 'next/font/google';
import type { ReactNode } from 'react';
import { MobileContactBar } from '@/components/layout/MobileContactBar';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { QueryProvider } from '@/components/providers/QueryProvider';
import { Toaster } from '@/components/ui/sonner';
import { api, optional } from '@/lib/api/server';
import { SITE_NAME, SITE_URL } from '@/lib/config';
import './globals.css';

// The italic carries the gold accent words in headlines.
const serif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
  variable: '--font-instrument-serif',
});
const sans = Geist({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-geist' });
const mono = Geist_Mono({ subsets: ['latin'], weight: '500', variable: '--font-geist-mono' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} · 360° event & brand activation agency`, template: `%s · ${SITE_NAME}` },
  description:
    'Concept, production, on-ground activation and digital amplification from one accountable team.',
  // Icons and the share image come from the icon/apple-icon/favicon/opengraph-image files in this folder.
  openGraph: { type: 'website', siteName: SITE_NAME, locale: 'en_IN' },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = { themeColor: '#FAF7F2' };

export default async function RootLayout({ children }: { children: ReactNode }) {
  // Header and footer must render even if the API is briefly unavailable.
  const [site, services] = await Promise.all([optional(api.site()), optional(api.services())]);
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col pb-16 md:pb-0">
        <a
          href="#main"
          className="sr-only z-50 bg-card px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:top-2 focus:left-2"
        >
          Skip to content
        </a>
        <QueryProvider>
          <SiteHeader phone={site?.phone ?? null} />
          <main id="main" className="flex-grow">
            {children}
          </main>
          <SiteFooter site={site} services={services ?? []} />
          <MobileContactBar site={site} />
          <Toaster position="top-center" />
        </QueryProvider>
        <Analytics />
      </body>
    </html>
  );
}
