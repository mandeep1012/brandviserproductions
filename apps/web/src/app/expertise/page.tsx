import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CtaBand } from '@/components/common/CtaBand';
import { EventImage } from '@/components/common/EventImage';
import { Eyebrow } from '@/components/common/Eyebrow';
import { FaqList } from '@/components/common/FaqList';
import { ProcessStrip } from '@/components/common/ProcessSteps';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ServiceMatrix } from '@/components/expertise/ServiceMatrix';
import { ServiceSection } from '@/components/expertise/ServiceSection';
import { ServiceSubnav } from '@/components/expertise/ServiceSubnav';
import { api, optional } from '@/lib/api/server';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Expertise',
  description:
    'Concept & Execution, BTL, ATL, Digital Campaigns and Production: five practices under one roof, one plan and one point of contact.',
};

export default async function ExpertisePage() {
  const [services, matrix, steps, faqs] = await Promise.all([
    api.services(),
    optional(api.serviceMatrix()),
    api.processSteps(),
    optional(api.faqs('EXPERTISE')),
  ]);
  const collage = services.slice(0, 3);

  return (
    <>
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Our Expertise' }]} />

      <section className="gutter grid gap-6 pt-4 pb-8 md:grid-cols-12 md:items-center md:pt-12 md:pb-20">
        <div className="flex flex-col gap-4 md:col-span-7 md:gap-5 md:pr-12">
          <Eyebrow>Our expertise</Eyebrow>
          <h1 className="text-h1">One team, from first idea to final teardown.</h1>
          <p className="max-w-[560px]">
            Five practices under one roof, so your campaign has one plan, one budget and one point of contact.
          </p>
        </div>
        <div className="grid h-50 grid-cols-[2fr_1fr] grid-rows-2 gap-3 md:col-span-5 md:h-80">
          {collage.map((service, index) => (
            <EventImage
              key={service.id}
              src={service.imageUrl}
              alt={`${service.name} event`}
              label={index === 0 ? 'Event photograph' : 'Photo'}
              sizes="(min-width: 48rem) 25vw, 60vw"
              className={index === 0 ? 'row-span-2 h-full' : 'h-full'}
            />
          ))}
        </div>
      </section>

      <ServiceSubnav services={services} />

      {services.map((service) => (
        <ServiceSection key={service.id} service={service} />
      ))}

      {matrix && (
        <Section>
          <SectionHeading title="What each event type draws on" className="md:mb-10" />
          <ServiceMatrix matrix={matrix} />
        </Section>
      )}

      <Section tone="white" spacing="compact">
        <ProcessStrip steps={steps} />
      </Section>

      {faqs && faqs.length > 0 && (
        <Section>
          <SectionHeading title="Questions buyers ask" className="md:mb-10" />
          <FaqList faqs={faqs} />
        </Section>
      )}

      <CtaBand
        title="Not sure which you need?"
        text="Tell us the outcome; we will recommend the mix."
        href={ENQUIRY_HREF}
        label="Talk to a planner"
      />
    </>
  );
}
