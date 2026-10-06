import type { Metadata } from 'next';
import { TeamGrid } from '@/components/about/TeamGrid';
import { ClientLogos } from '@/components/common/ClientLogos';
import { CtaBand } from '@/components/common/CtaBand';
import { EventImage } from '@/components/common/EventImage';
import { Eyebrow } from '@/components/common/Eyebrow';
import { ProcessStepsDetailed } from '@/components/common/ProcessSteps';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { StatsRow } from '@/components/common/StatsRow';
import { about } from '@/content/about';
import { api, optional } from '@/lib/api/server';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'About & Process',
  description: 'Who BRANDVISER is and the four steps from first meeting to final report.',
};

export default async function AboutPage() {
  const [site, steps, team, testimonials] = await Promise.all([
    optional(api.site()),
    api.processSteps(),
    optional(api.team()),
    optional(api.testimonials({ featured: true, limit: 1 })),
  ]);
  const quote = testimonials?.[0];
  const stats = site ? (
    <StatsRow stats={site.stats} keys={['citiesCovered', 'clientBrands', 'eventsDelivered', 'yearsExperience']} tone="navy" />
  ) : null;

  return (
    <>
      <section className="gutter grid gap-6 pt-8 pb-8 md:grid-cols-2 md:items-center md:gap-16 md:py-20">
        <div className="flex flex-col gap-4 md:gap-5">
          <Eyebrow>{about.intro.eyebrow}</Eyebrow>
          <h1 className="text-h1">{about.intro.title}</h1>
          <p>{about.intro.text}</p>
        </div>
        <EventImage
          src={about.intro.imageUrl}
          alt="The BRANDVISER team at work"
          label="Team at work · photograph"
          priority
          sizes="(min-width: 48rem) 50vw, 100vw"
          className="aspect-[4/3] md:aspect-auto md:h-110"
        />
      </section>

      {site && Object.values(site.stats).some((v) => v !== null) && (
        <Section tone="navy" spacing="none" className="py-8 md:py-14">
          {stats}
        </Section>
      )}

      <Section className="grid gap-4 md:grid-cols-12 md:gap-6">
        <h2 className="text-h2 md:col-span-5 md:pr-12">{about.story.title}</h2>
        <div className="flex flex-col gap-4 md:col-span-7 md:gap-5">
          {about.story.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <figure className="mt-2 border-t border-ink pt-5 md:mt-4 md:pt-6">
            <blockquote className="font-serif text-2xl leading-8 md:text-[30px] md:leading-[38px]">
              {about.story.founderQuote}
            </blockquote>
            <figcaption className="text-small mt-3 text-slate">{about.story.founderName}, Founder</figcaption>
          </figure>
        </div>
      </Section>

      <Section tone="white" id="process" className="scroll-mt-20">
        <SectionHeading eyebrow="How we work" title="Four steps from first meeting to final report." className="md:mb-14" />
        <ProcessStepsDetailed steps={steps} />
      </Section>

      <Section>
        <SectionHeading title="Why clients stay" className="mb-4 md:mb-12" />
        <ul className="grid md:grid-cols-3 md:gap-6">
          {about.whyClientsStay.map((item) => (
            <li
              key={item.title}
              className="flex flex-col gap-1 border-t border-rule py-4 md:min-h-37 md:gap-2 md:rounded-md md:border md:bg-card md:p-6"
            >
              <h3 className="text-h3">{item.title}</h3>
              <p className="text-small text-slate">{item.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      {team && team.length > 0 && (
        <Section spacing="none" className="pb-12 md:pb-24">
          <SectionHeading title="The team" />
          <TeamGrid team={team} />
        </Section>
      )}

      {(site?.clientLogos.length || quote) && (
        <Section spacing="compact" className="border-t border-rule">
          {site && <ClientLogos logos={site.clientLogos} />}
          {quote && (
            <figure className="mt-8 max-w-[900px] md:mt-12">
              <blockquote className="text-h2">{quote.quote}</blockquote>
              <figcaption className="text-small mt-4 text-slate">
                {quote.name}, {quote.role}, {quote.company}
              </figcaption>
            </figure>
          )}
        </Section>
      )}

      <CtaBand
        title="Step one is a conversation."
        text="Thirty minutes, no obligation."
        href="/contact#enquiry"
        label="Book a meeting"
      />
    </>
  );
}
