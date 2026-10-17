import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { ClientLogos } from '@/components/common/ClientLogos';
import { Eyebrow } from '@/components/common/Eyebrow';
import { FaqList } from '@/components/common/FaqList';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { DirectLines, NextSteps, Office, QuickContactButtons } from '@/components/contact/ContactDetails';
import { EnquiryForm } from '@/components/contact/EnquiryForm';
import { GlobalPresence } from '@/components/contact/GlobalPresence';
import { MapLink } from '@/components/contact/MapLink';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { api, optional } from '@/lib/api/server';
import { hasValue } from '@/lib/contact-links';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Contact & Booking',
  description: 'Tell us about your event. We reply within one working day.',
};

const CONTACT_LOGOS = ['HDFC Bank', 'Visa', 'BMW Motorrad', 'Uber', 'Gates Foundation'];

/** The FAQ ("Before you write") stays hidden until BRANDVISER confirms its questions and answers. */
const SHOW_FAQS = false;

function CallBackButton() {
  return (
    <Button asChild variant="outline">
      <Link href={ENQUIRY_HREF}>Request a call back</Link>
    </Button>
  );
}

export default async function ContactPage() {
  const [site, services, faqs] = await Promise.all([
    optional(api.site()),
    api.services(),
    optional(api.faqs('CONTACT')),
  ]);
  // Company-wide numbers from the site settings (as on the home page); one the API doesn't send yet is left out.
  const highlights = [
    { value: site?.stats.clientBrands, label: 'brands' },
    { value: site?.stats.eventsDelivered, label: 'projects' },
    { value: site?.stats.citiesCovered, label: 'cities' },
    { value: site?.stats.countriesCovered, label: 'countries' },
  ].filter((item): item is { value: number; label: string } => typeof item.value === 'number');
  // Only questions with a confirmed answer are shown; placeholder answers stay hidden until filled in.
  const answeredFaqs = faqs?.filter((faq) => hasValue(faq.answer)) ?? [];
  // The five logos beside the form, in this order; falls back to the first five if the names ever change.
  const picked = CONTACT_LOGOS.flatMap((name) => site?.clientLogos.filter((logo) => logo.name === name) ?? []);
  const contactLogos = picked.length > 0 ? picked : (site?.clientLogos ?? []);

  return (
    <>
      <section className="grid gap-6 pt-8 pb-12 md:gutter lg:grid-cols-12 lg:items-start lg:gap-6 lg:pt-20 lg:pb-24">
        <div className="flex flex-col gap-3 px-4 md:px-0 lg:col-span-5 lg:gap-6 lg:pr-12">
          <Eyebrow rule>Contact</Eyebrow>
          <h1 className="text-h1">
            Tell us about <em className="text-metal">your event.</em>
          </h1>
          <p>We reply within one working day.</p>
          {site && <QuickContactButtons site={site} />}
          <div className="hidden flex-col gap-6 lg:flex">
            {site && <DirectLines site={site} />}
            {site && <Office site={site} />}
            <NextSteps variant="compact" />
            <div className="border-t border-rule pt-5">
              {contactLogos.length > 0 && (
                <ClientLogos logos={contactLogos} columns={5} className="grid-cols-5 gap-2 md:gap-2 [&>li]:h-11" />
              )}
              {/* An excerpt from Truefitt & Hill's testimonial, set as a pull quote. */}
              <figure className="mt-10 flex flex-col gap-3 border-l-2 border-gold-500 pl-5">
                <blockquote className="font-serif text-2xl leading-8 text-navy">
                  “Their professionalism and attention to detail are exceptional.”
                </blockquote>
                <figcaption className="eyebrow text-slate">Truefitt &amp; Hill, London</figcaption>
              </figure>
              {highlights.length > 0 && (
                <p className="mt-10 flex flex-wrap gap-x-2 gap-y-1 border-t border-rule pt-5 text-[15px] text-slate">
                  {highlights.map((item, index) => (
                    <span key={item.label}>
                      {index > 0 && <span aria-hidden className="mr-2 text-gold-500">·</span>}
                      <span className="font-semibold text-navy">{item.value.toLocaleString('en-IN')}+</span> {item.label}
                    </span>
                  ))}
                </p>
              )}
            </div>
          </div>
        </div>

        <div
          id="enquiry"
          className="gold-edge mx-4 scroll-mt-20 rounded-lg border border-rule bg-card px-4 py-6 md:mx-0 md:p-10 lg:col-span-7"
        >
          <Suspense fallback={<Skeleton className="h-150 bg-placeholder" />}>
            <EnquiryForm services={services} phone={site?.phone ?? null} />
          </Suspense>
        </div>
      </section>

      <Section spacing="compact" className="lg:pt-0">
        <GlobalPresence />
      </Section>

      {/* Mobile: next steps, office and booking below the form */}
      <div className="lg:hidden">
        <Section spacing="compact">
          <h2 className="text-h2 mb-4">What happens next</h2>
          <NextSteps variant="rows" />
        </Section>
        {site && (
          <Section tone="white" spacing="compact" id="book" className="flex flex-col gap-3">
            <p className="eyebrow text-eyebrow">Office</p>
            <address className="not-italic">{site.address}</address>
            {hasValue(site.hours) && <p className="text-small text-slate">{site.hours}</p>}
            <Button asChild variant="outline" className="mt-2">
              <a href={site.mapUrl} target="_blank" rel="noopener noreferrer">
                Open in Maps
              </a>
            </Button>
            <CallBackButton />
          </Section>
        )}
      </div>

      {/* Desktop: booking band and map */}
      <div className="hidden lg:block">
        <Section tone="white" spacing="compact" id="book-desktop" className="flex items-center justify-between">
          <h2 className="text-h2">Prefer to talk?</h2>
          <CallBackButton />
        </Section>
        {site && (
          <Section spacing="compact">
            <MapLink mapUrl={site.mapUrl} imageUrl={site.mapImageUrl} address={site.address} />
          </Section>
        )}
      </div>

      {SHOW_FAQS && answeredFaqs.length > 0 && (
        <Section className="lg:pt-8">
          <SectionHeading title="Before you write" className="md:mb-10" />
          <FaqList faqs={answeredFaqs} />
        </Section>
      )}
    </>
  );
}
