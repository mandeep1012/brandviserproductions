import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/common/Breadcrumbs';
import { CtaBand } from '@/components/common/CtaBand';
import { EventImage } from '@/components/common/EventImage';
import { Eyebrow } from '@/components/common/Eyebrow';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { ServiceMatrix } from '@/components/expertise/ServiceMatrix';
import { ServiceSection } from '@/components/expertise/ServiceSection';
import { ServiceSubnav } from '@/components/expertise/ServiceSubnav';
import { WhyBrandviser } from '@/components/expertise/WhyBrandviser';
import { api, optional } from '@/lib/api/server';
import { ENQUIRY_HREF } from '@/lib/navigation';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'Our Expertise',
  description:
    'Events & experiential, corporate events, business conferences and international MICE: four practices under one roof, one plan and one point of contact.',
};

export default async function ExpertisePage() {
  const [services, matrix] = await Promise.all([api.services(), optional(api.serviceMatrix())]);
  const collage = services.slice(0, 3);

  return (
    <>
      <Breadcrumbs items={[{ href: '/', label: 'Home' }, { label: 'Our Expertise' }]} />

      <section className="gutter grid gap-6 pt-4 pb-8 md:grid-cols-12 md:items-center md:pt-12 md:pb-20">
        <div className="flex flex-col gap-4 md:col-span-7 md:gap-5 md:pr-12">
          <Eyebrow rule>Our expertise</Eyebrow>
          <h1 className="text-h1">
            One team, from first idea to <em className="text-metal">final teardown.</em>
          </h1>
          <div className="flex max-w-[560px] flex-col gap-3">
            <p>
              Today, we stand as a premier partner for brands that demand more than “standard.” We are a collective of
              strategists, designers, and production specialists dedicated to the art of the extraordinary.
            </p>
            <p>
              We specialize in a dual-focus approach that combines high-precision print craftsmanship with world-class
              event production, from MICE and bespoke international retreats to large-scale BTL activations. With a
              pan-India presence, we deliver end-to-end campaigns across apartment communities, malls and roadshows,
              managing everything from individual activations to large-scale, multi-city rollouts with consistency and
              precision.
            </p>
          </div>
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

      <Section tone="white">
        <SectionHeading title="Why BRANDVISER" className="md:mb-10" />
        <WhyBrandviser />
      </Section>

      <CtaBand
        title="Not sure which you need?"
        text="Tell us the outcome; we will recommend the mix."
        href={ENQUIRY_HREF}
        label="Talk to a planner"
      />
    </>
  );
}
