import Link from 'next/link';
import { ClientLogos } from '@/components/common/ClientLogos';
import { Eyebrow } from '@/components/common/Eyebrow';
import { ProcessStepsCompact } from '@/components/common/ProcessSteps';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { Testimonials } from '@/components/common/Testimonials';
import { FeaturedWork } from '@/components/home/FeaturedWork';
import { Hero } from '@/components/home/Hero';
import { QuickEnquiryForm } from '@/components/home/QuickEnquiryForm';
import { ServiceCards } from '@/components/home/ServiceCards';
import { Button } from '@/components/ui/button';
import { api, optional } from '@/lib/api/server';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const revalidate = 300;

export default async function HomePage() {
  const [site, services, steps, featured, testimonials] = await Promise.all([
    optional(api.site()),
    api.services(),
    api.processSteps(),
    optional(api.caseStudies({ featured: true, limit: 3 })),
    optional(api.testimonials({ featured: true, limit: 3 })),
  ]);
  const featuredStudies = featured?.items ?? [];

  return (
    <>
      <Hero stats={site?.stats ?? null} imageUrl={featuredStudies[0]?.coverImageUrl ?? null} />

      {site && site.clientLogos.length > 0 && (
        <section className="gutter border-y border-rule py-8 md:flex md:items-center md:gap-8 md:py-10">
          <Eyebrow className="mb-4 w-30 flex-none md:mb-0">Trusted by</Eyebrow>
          <ClientLogos logos={site.clientLogos} className="flex-grow" />
        </section>
      )}

      <Section>
        <SectionHeading title="Our expertise" link={{ href: '/expertise', label: 'All services' }} />
        <ServiceCards services={services} />
      </Section>

      <Section tone="white">
        <SectionHeading
          eyebrow="How we work"
          title="Four steps, one point of contact."
          link={{ href: '/about#process', label: 'Our process' }}
          className="md:mb-14"
        />
        <ProcessStepsCompact steps={steps} />
        <Link href="/about#process" className="mt-4 flex min-h-11 items-center md:hidden">
          Our process →
        </Link>
      </Section>

      {featuredStudies.length > 0 && (
        <Section>
          <SectionHeading title="From the gallery" link={{ href: '/gallery', label: 'All case studies' }} />
          <FeaturedWork studies={featuredStudies} />
        </Section>
      )}

      {testimonials && testimonials.length > 0 && (
        <Section className="border-t border-rule">
          <SectionHeading title="What clients say" />
          <Testimonials testimonials={testimonials} />
        </Section>
      )}

      <Section tone="white" spacing="compact" className="border-b-0 md:py-20">
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-h2">Have a brief? Let&apos;s meet.</h2>
            <p className="text-small mt-2 text-slate md:mt-3">We reply within one working day.</p>
          </div>
          <div className="hidden lg:contents">
            <QuickEnquiryForm />
          </div>
          <Button asChild className="lg:hidden">
            <Link href={ENQUIRY_HREF}>Enquire</Link>
          </Button>
        </div>
      </Section>
    </>
  );
}
