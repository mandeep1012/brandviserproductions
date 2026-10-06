/**
 * Seeds the content the wireframes define, plus clearly marked placeholders for what only
 * BRANDVISER can supply (case studies, testimonials, team, stats, contact details).
 * Re-runnable: content tables are replaced; enquiries are never touched.
 *
 *   npm run db:seed
 */
import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { PrismaClient, type EventType } from '../src/generated/prisma/client.js';
import { withExplicitSslMode } from '../src/prisma/connection-string.js';

const pool = new Pool({
  connectionString: withExplicitSslMode(process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL ?? ''),
});
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const placeholderImage = (seed: string, w = 1200, h = 900) => `https://picsum.photos/seed/bvp-${seed}/${w}/${h}`;

// ── From the wireframes ──

const services = [
  {
    slug: 'concept-execution',
    number: '01',
    name: 'Concept & Execution',
    shortName: 'Concept',
    line: 'Theme, creative concept, show flow and on-ground delivery.',
    description:
      'We turn a brief into a theme, a show flow and a delivered event, with one team accountable from idea to teardown.',
    deliverables: [
      'Theme and creative concept',
      'Show flow and scripting',
      'Venue and logistics',
      'Talent and entertainment',
      'On-ground management',
      'Post-event report',
    ],
  },
  {
    slug: 'btl',
    number: '02',
    name: 'BTL',
    shortName: 'BTL',
    line: 'Activations, roadshows, sampling and retail branding.',
    description: 'Direct, on-ground engagement that puts the product in the hands of the people you want to reach.',
    deliverables: [
      'Brand activations',
      'Mall and society promotions',
      'Roadshows',
      'Sampling',
      'Retail branding',
      'Promoter teams',
    ],
  },
  {
    slug: 'atl',
    number: '03',
    name: 'ATL',
    shortName: 'ATL',
    line: 'TV, print, radio and outdoor planning and buying.',
    description: 'Mass-reach media planned and bought alongside the event, so the campaign lands as one message.',
    deliverables: ['Television', 'Print', 'Radio', 'Outdoor', 'Cinema', 'Media planning and buying'],
  },
  {
    slug: 'digital-campaigns',
    number: '04',
    name: 'Digital Campaigns',
    shortName: 'Digital',
    line: 'Social, influencer, performance and event microsites.',
    description: 'Online amplification before, during and after the event, measured against registrations and reach.',
    deliverables: [
      'Social media campaigns',
      'Influencer programmes',
      'Performance marketing',
      'Event microsites',
      'Live coverage',
      'Reporting',
    ],
  },
  {
    slug: 'production',
    number: '05',
    name: 'Production',
    shortName: 'Production',
    line: 'Fabrication, stage, AV, light, sound and print.',
    description:
      'In-house fabrication and technical production, which keeps quality, cost and timelines under one roof.',
    deliverables: [
      'Stage and set fabrication',
      'Audio-visual',
      'Light and sound',
      'Exhibition stalls',
      'Print and signage',
      'Installation and dismantling',
    ],
  },
];

/** "What each event type draws on". Indicative; confirm against BRANDVISER's real service mix. */
const matrix: Record<EventType, string[]> = {
  CORPORATE: ['concept-execution', 'digital-campaigns', 'production'],
  PRODUCT_LAUNCH: ['concept-execution', 'btl', 'atl', 'digital-campaigns', 'production'],
  CONFERENCE: ['concept-execution', 'digital-campaigns', 'production'],
  BRAND_ACTIVATION: ['concept-execution', 'btl', 'digital-campaigns', 'production'],
  EXHIBITION: ['concept-execution', 'btl', 'production'],
};

const processSteps = [
  {
    number: '01',
    name: 'Meet & Agree',
    line: 'We take the brief, agree goals, budget and dates.',
    detail: 'We take the brief in person or on a call and agree goals, audience, budget range and dates.',
    deliverable: 'Signed-off brief',
  },
  {
    number: '02',
    name: 'Idea & Concept',
    line: 'A concept deck with theme, flow and references.',
    detail: 'The creative team develops a theme, show flow and references that answer the brief.',
    deliverable: 'Concept deck',
  },
  {
    number: '03',
    name: 'Design & Plan',
    line: 'Designs, vendor plan, costing and timeline for sign-off.',
    detail: 'Stage and collateral designs, vendor plan, itemised costing and a day-by-day timeline.',
    deliverable: 'Designs and budget',
  },
  {
    number: '04',
    name: 'Execute & Report',
    line: 'On-ground delivery, then a post-event report.',
    detail: 'Our on-ground team delivers the event, then reports on attendance, reach and learnings.',
    deliverable: 'Event and report',
  },
];

const faqs = {
  EXPERTISE: [
    'How much lead time do you need?',
    'Which cities do you cover?',
    'Can you work with our existing vendors?',
    'Do you handle permissions and licences?',
    'How is the budget structured?',
    'What do we receive after the event?',
  ],
  CONTACT: [
    'How much lead time do you need?',
    'Which cities do you cover?',
    'Is there a minimum budget?',
    'What are your payment terms?',
  ],
} as const;

// ── Placeholders (replace with client-approved content before launch) ──

const eventTypes: EventType[] = ['CORPORATE', 'PRODUCT_LAUNCH', 'BRAND_ACTIVATION', 'CONFERENCE', 'EXHIBITION'];
const cities = ['[City A]', '[City B]', '[City C]', '[City D]'];
const serviceSets = [
  ['production', 'concept-execution'],
  ['btl', 'production'],
  ['concept-execution', 'digital-campaigns'],
  ['production', 'atl'],
  ['btl', 'digital-campaigns'],
];

const caseStudies = Array.from({ length: 15 }, (_, i) => {
  const n = String(i + 1).padStart(2, '0');
  return {
    slug: `placeholder-event-${n}`,
    client: '[Client]',
    title: `[Event name ${n}]`,
    eventType: eventTypes[i % eventTypes.length]!,
    city: cities[i % cities.length]!,
    eventDate: new Date(Date.UTC(2026 - (i % 4), (i * 5) % 12, 10)),
    summary: '[One-sentence summary: the brief, the idea and the outcome.]',
    body: [
      '[The brief: what the client needed, for whom, and by when.]',
      '[The idea: the theme and show flow we proposed, and why.]',
      '[The delivery: production, on-ground team and any constraints we solved.]',
      '[The result: attendance, reach, coverage or sales impact the client has approved for publication.]',
    ].join('\n\n'),
    coverImageUrl: placeholderImage(`case-${n}`),
    gallery: [1, 2, 3, 4].map((k) => placeholderImage(`case-${n}-${k}`)),
    attendees: null,
    citiesCount: null,
    days: null,
    isFeatured: i < 3,
    sortOrder: i,
    serviceSlugs: serviceSets[i % serviceSets.length]!,
  };
});

async function main(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        description: '[One-line company description]',
        phone: '[Phone]',
        whatsapp: '[WhatsApp number]',
        email: '[Email]',
        address: '[Office address, city, PIN]',
        hours: '[Opening hours]',
        mapUrl: 'https://maps.google.com',
        mapImageUrl: null,
        // Stats stay empty until BRANDVISER confirms them; the site hides empty stats.
        citiesCovered: null,
        clientBrands: null,
        eventsDelivered: null,
        yearsExperience: null,
      },
    });

    await tx.testimonial.deleteMany();
    await tx.caseStudy.deleteMany();
    await tx.eventTypeOffering.deleteMany();
    await tx.service.deleteMany();
    await tx.processStep.deleteMany();
    await tx.faq.deleteMany();
    await tx.teamMember.deleteMany();
    await tx.clientLogo.deleteMany();

    for (const [index, service] of services.entries()) {
      await tx.service.create({ data: { ...service, sortOrder: index } });
    }
    const serviceIds = new Map((await tx.service.findMany()).map((s) => [s.slug, s.id]));
    await tx.eventTypeOffering.createMany({
      data: Object.entries(matrix).flatMap(([eventType, slugs]) =>
        slugs.map((slug) => ({ eventType: eventType as EventType, serviceId: serviceIds.get(slug)! })),
      ),
    });

    await tx.processStep.createMany({ data: processSteps.map((step, index) => ({ ...step, sortOrder: index })) });

    await tx.faq.createMany({
      data: (Object.entries(faqs) as Array<[keyof typeof faqs, readonly string[]]>).flatMap(([page, questions]) =>
        questions.map((question, index) => ({ page, question, answer: '[Answer]', sortOrder: index })),
      ),
    });

    for (const { serviceSlugs, ...caseStudy } of caseStudies) {
      await tx.caseStudy.create({
        data: { ...caseStudy, services: { connect: serviceSlugs.map((slug) => ({ slug })) } },
      });
    }

    const featured = await tx.caseStudy.findFirst({ where: { isFeatured: true }, orderBy: { sortOrder: 'asc' } });
    await tx.testimonial.createMany({
      data: [0, 1, 2].map((index) => ({
        quote: '[Client testimonial, two to three sentences]',
        name: '[Name]',
        role: '[Role]',
        company: '[Company]',
        isFeatured: true,
        sortOrder: index,
        caseStudyId: index === 0 ? featured?.id : undefined,
      })),
    });

    await tx.teamMember.createMany({
      data: [0, 1, 2, 3].map((index) => ({ name: '[Name]', role: '[Role]', portraitUrl: null, sortOrder: index })),
    });

    await tx.clientLogo.createMany({
      data: [0, 1, 2, 3, 4, 5].map((index) => ({ name: `[Client logo ${index + 1}]`, logoUrl: null, sortOrder: index })),
    });
    // Dozens of round trips: allow for a remote database, not just a local one.
  }, { timeout: 60_000, maxWait: 10_000 });

  const [serviceCount, caseStudyCount] = await Promise.all([prisma.service.count(), prisma.caseStudy.count()]);
  console.log(`Seeded ${serviceCount} services and ${caseStudyCount} placeholder case studies.`);
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
