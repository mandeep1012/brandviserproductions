/**
 * Seeds the site content. Services, process, testimonials, client logos, gallery photography, team
 * and contact details are migrated from BRANDVISER's previous website (firefoxproductions.in) and
 * public company records. Bracketed text is a placeholder for what only BRANDVISER can confirm
 * (testimonial names, FAQ answers, event details for gallery photos).
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

/** Images live in the web app's public folder (apps/web/public/migrated). */
const photo = (name: string) => `/migrated/gallery/${name}.jpg`;

// ── Services and process ──

const services = [
  {
    slug: 'concept-execution',
    number: '01',
    name: 'Events: Concept & Execution',
    shortName: 'Concept',
    line: 'Corporate events, conferences and seminars, planned and run end to end.',
    description:
      'We start by understanding the requirement and objective of your event, then plan and run every part of it. For conferences, conventions and business meetings we offer partial or full conference management, so your time is free and the event runs smoothly, looks professional and stays within budget.',
    deliverables: [
      'Corporate events',
      'Conferences and seminars',
      'Partial or full conference management',
      'Venue selection',
      'Corporate outings and off-sites',
      'Sponsorship events',
    ],
    imageUrl: '/migrated/services/concept-execution.jpg',
  },
  {
    slug: 'btl',
    number: '02',
    name: 'BTL Campaigns',
    shortName: 'BTL',
    line: 'Activations, mall promotions, roadshows and retail branding.',
    description:
      'BTL activations put your brand in front of the people you want to reach, and build a relationship with customers that turns into brand loyalty and sales leads.',
    deliverables: [
      'RWA activities',
      'Mall promotions',
      'Metro branding',
      'Store branding',
      'Roadshows',
      'Lookman walkers',
      'Newspaper inserts',
      'No-parking boards and signage',
    ],
    imageUrl: '/migrated/services/btl.jpg',
  },
  {
    slug: 'atl',
    number: '03',
    name: 'ATL Campaigns',
    shortName: 'ATL',
    line: 'Television, radio, cinema and outdoor media.',
    description:
      'Mass-media promotion that reaches a large audience and builds brand awareness. Audio and visual together grab attention at scale: you share your plan, we get you the traffic.',
    deliverables: ['Television advertising', 'Radio ads', 'Theatre ads and branding', 'OOH media'],
    imageUrl: '/migrated/services/atl.jpg',
  },
  {
    slug: 'digital-campaigns',
    number: '04',
    name: 'Digital Campaigns',
    shortName: 'Digital',
    line: 'Search, social, email and influencer marketing.',
    description:
      'We promote your brand across digital channels and create the traffic that leads to better sales and marketing.',
    deliverables: ['Search engine marketing', 'Social media marketing', 'Email marketing', 'Influencer marketing'],
    imageUrl: '/migrated/services/digital-campaigns.jpg',
  },
  {
    slug: 'production',
    number: '05',
    name: 'Production Services',
    shortName: 'Production',
    line: 'Stage, AV, fabrication and print, delivered across the country.',
    description:
      'Our production team delivers the technical side that makes an event sparkle, with in-house production at venues across the country. We only get one chance to get it right, so we never underestimate production. For print, we offer single-window support with easy call logging across 600 locations, at no extra cost.',
    deliverables: [
      'Stage set-up for every seating arrangement',
      'Audio design and lighting',
      'Presentation support',
      'Flyers, standees and banners',
      'Merchandise: T-shirts, mugs, calendars and diaries',
      'Exhibition displays',
      'Marketing collateral',
    ],
    imageUrl: '/migrated/services/production.jpg',
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
    name: 'Design & Create',
    line: 'Designs, costing and a timeline for sign-off.',
    detail: 'Stage and collateral designs, an itemised costing and a day-by-day timeline, signed off before anything is built.',
    deliverable: 'Designs and budget',
  },
  {
    number: '04',
    name: 'Build & Execute',
    line: 'Fabrication, on-ground delivery, then a wrap-up report.',
    detail: 'We build the set and run the event on the ground, then report on attendance, reach and learnings.',
    deliverable: 'Event and report',
  },
];

const citiesAnswer =
  'We work across India. Our teams have run campaigns in over 300 cities, and our print support covers 600 locations across the country at no extra cost.';

const faqs: Record<'EXPERTISE' | 'CONTACT', Array<[question: string, answer: string]>> = {
  EXPERTISE: [
    ['How much lead time do you need?', '[Answer]'],
    ['Which cities do you cover?', citiesAnswer],
    ['Can you work with our existing vendors?', '[Answer]'],
    ['Do you handle permissions and licences?', '[Answer]'],
    ['How is the budget structured?', '[Answer]'],
    ['What do we receive after the event?', '[Answer]'],
  ],
  CONTACT: [
    ['How much lead time do you need?', '[Answer]'],
    ['Which cities do you cover?', citiesAnswer],
    ['Is there a minimum budget?', '[Answer]'],
    ['What are your payment terms?', '[Answer]'],
  ],
};

// ── Gallery ──
// Photos come from the previous site's gallery. Clients are named only where their brand is visible
// in the photos. Dates come from photo metadata where present; otherwise they are the year the photos
// were shared and should be confirmed (marked "approx.").

const day = (y: number, m = 1, d = 1) => new Date(Date.UTC(y, m - 1, d));
const detailsToConfirm = '[Brief, idea, delivery and results: to be confirmed with BRANDVISER before launch.]';

const caseStudies: Array<{
  slug: string;
  client: string;
  title: string;
  eventType: EventType;
  city: string;
  eventDate: Date;
  summary: string;
  photos: string[];
  days?: number;
  isFeatured?: boolean;
  serviceSlugs: string[];
}> = [
  {
    slug: 'visa-womens-network-walkathon-2024',
    client: 'Visa',
    title: "Women's Network Walkathon '24",
    eventType: 'CORPORATE',
    city: '[City]',
    eventDate: day(2024), // approx.
    summary: "An employee walkathon for Visa's Women's Network, with branding, kits and on-ground management.",
    photos: ['visa-walkathon-2024'],
    isFeatured: true,
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'groww-india-kamaega-invest',
    client: 'Groww',
    title: 'India Kamaega Invest session',
    eventType: 'CONFERENCE',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: "An investor-education session under Groww's \"India Kamaega Invest\" banner: venue, stage, AV and branding.",
    photos: ['groww-india-kamaega-invest'],
    isFeatured: true,
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'swiggy-mangaluru-launch',
    client: 'Swiggy',
    title: 'Mangaluru launch activation',
    eventType: 'BRAND_ACTIVATION',
    city: 'Mangaluru',
    eventDate: day(2020), // approx.
    summary: 'A mall stage activation announcing "Swiggy is coming to Mangaluru!", with live engagement for shoppers.',
    photos: ['swiggy-mangaluru-launch'],
    isFeatured: true,
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'international-delegation-programme-2024',
    client: '[Client]',
    title: 'Two-day delegation programme',
    eventType: 'CONFERENCE',
    city: '[City]',
    eventDate: day(2024, 12, 5),
    summary: 'Conference sessions, hosted meals, a cultural evening and closed-door meetings for a visiting delegation.',
    photos: [
      'delegation-2024-conference',
      'delegation-2024-lunch',
      'delegation-2024-evening',
      'delegation-2024-banquet',
      'delegation-2024-meeting',
    ],
    days: 2,
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'visa-bangalore-technology-centre',
    client: 'Visa',
    title: 'Bangalore Technology Centre engagement',
    eventType: 'CORPORATE',
    city: 'Bengaluru',
    eventDate: day(2023, 4, 12),
    summary: 'Branded "Grow, Build, Connect, Uplift" standees and entrance set-up for an employee event at the Visa Bangalore Technology Centre.',
    photos: ['visa-btc-entrance'],
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'visa-cultural-evening',
    client: 'Visa',
    title: 'Cultural evening',
    eventType: 'CORPORATE',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'Stage, lighting and performers for a Visa employee celebration.',
    photos: ['visa-btc-stage'],
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'the-glenlivet-brand-evening',
    client: 'The Glenlivet',
    title: 'Brand evening',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'A lit, branded guest entrance with The Glenlivet light-box cubes.',
    photos: ['glenlivet-evening'],
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'sbi-card-kiosk',
    client: 'SBI Card',
    title: 'Acquisition kiosk',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'A fabricated, illuminated SBI Card kiosk with on-ground staff for customer acquisition.',
    photos: ['sbi-card-kiosk'],
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'car-launch-showroom-unveil',
    client: '[Client]',
    title: 'Car launch and showroom unveil',
    eventType: 'PRODUCT_LAUNCH',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'A showroom unveiling with draped reveal, balloon décor, LED backdrop and a launch-day photo moment.',
    photos: ['car-launch-unveil', 'car-launch-showroom'],
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'groww-office-decor',
    client: 'Groww',
    title: 'Office festive décor',
    eventType: 'CORPORATE',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'Festive lanterns and installations across a Groww office reception.',
    photos: ['groww-office-decor'],
    serviceSlugs: ['production'],
  },
  {
    slug: 'ib-cricket-vr-zone',
    client: 'iB Cricket',
    title: 'VR cricket experience zone',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'A turfed VR cricket zone with branded LED screen, where guests faced "the world\'s most played VR cricket".',
    photos: ['ib-cricket-vr'],
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'conference-stage-and-av-2024',
    client: '[Client]',
    title: 'Conference stage and AV',
    eventType: 'CONFERENCE',
    city: '[City]',
    eventDate: day(2024, 11, 7),
    summary: 'A ballroom conference with LED wall, side screens, truss lighting and a panel stage.',
    photos: ['conference-ballroom-stage'],
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'conferences-and-seminars',
    client: '[Client]',
    title: 'Conferences and seminars',
    eventType: 'CONFERENCE',
    city: '[City]',
    eventDate: day(2025, 1), // approx.
    summary: 'Roundtable sessions, auditorium seminars and boardroom meetings, with stage, screens and branding.',
    photos: ['conference-roundtables', 'conference-chandelier-hall', 'conference-auditorium', 'conference-boardroom'],
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'google-product-activations',
    client: 'Google',
    title: 'Product activations',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2016), // approx.
    summary: 'Branded Google stages and demo zones in a mall atrium and an office lobby, with promoter teams.',
    photos: ['google-mall-stage', 'google-office-activation'],
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'swiggy-brand-stage-and-office',
    client: 'Swiggy',
    title: 'Brand stage and office branding',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'An outdoor Swiggy stage with truss, LED screen and branded cubes, plus a branded office mural wall.',
    photos: ['swiggy-stage', 'swiggy-brand-wall'],
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'tech-park-employee-engagement',
    client: '[Client]',
    title: 'Tech-park employee engagement',
    eventType: 'CORPORATE',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'Branded game zones in an office-campus plaza, drawing crowds of employees.',
    photos: ['tech-park-engagement', 'tech-park-engagement-2'],
    serviceSlugs: ['concept-execution', 'btl'],
  },
  {
    slug: 'fujitsu-family-day-2016',
    client: 'Fujitsu',
    title: 'Family Day 2016',
    eventType: 'CORPORATE',
    city: '[City]',
    eventDate: day(2016),
    summary: 'An outdoor employee family day with stilt walkers and a branded photo frame.',
    photos: ['fujitsu-family-day-2016'],
    serviceSlugs: ['concept-execution'],
  },
  {
    slug: 'emc-vmware-hybrid-cloud-launch',
    client: 'EMC and VMware',
    title: 'Hybrid Cloud Redefined launch',
    eventType: 'PRODUCT_LAUNCH',
    city: '[City]',
    eventDate: day(2017), // approx.
    summary: 'A launch stage with triple screens and lighting for "Hybrid Cloud Redefined".',
    photos: ['emc-vmware-hybrid-cloud'],
    serviceSlugs: ['concept-execution', 'production'],
  },
  {
    slug: 'jaguar-xf-display',
    client: 'Jaguar',
    title: 'XF display',
    eventType: 'PRODUCT_LAUNCH',
    city: '[City]',
    eventDate: day(2017), // approx.
    summary: 'A display platform with branded XF towers and lighting for a Jaguar showcase.',
    photos: ['jaguar-xf-display'],
    serviceSlugs: ['production'],
  },
  {
    slug: 'siemens-exhibition-stall',
    client: 'Siemens',
    title: 'Exhibition stall',
    eventType: 'EXHIBITION',
    city: '[City]',
    eventDate: day(2017), // approx.
    summary: 'A fabricated Siemens exhibition stall with product display bays and a reception counter.',
    photos: ['siemens-exhibition-stall'],
    serviceSlugs: ['production'],
  },
  {
    slug: 'uber-mobile-van',
    client: 'Uber',
    title: 'Driver-partner mobile van',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'A branded mobile van for Uber driver-partner attachment, on the road across neighbourhoods.',
    photos: ['uber-mobile-van'],
    serviceSlugs: ['btl'],
  },
  {
    slug: 'ola-on-ground-activation',
    client: 'Ola',
    title: 'On-ground activation',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'An Ola canopy stall with branded backdrop and promoters engaging visitors.',
    photos: ['ola-activation'],
    serviceSlugs: ['btl'],
  },
  {
    slug: 'vlcc-store-branding',
    client: 'VLCC',
    title: 'Store branding',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'Facade signage and bilingual store branding for a VLCC centre.',
    photos: ['vlcc-store-branding'],
    serviceSlugs: ['btl', 'production'],
  },
  {
    slug: 'sugar-mall-branding',
    client: 'SUGAR Cosmetics',
    title: 'Mall branding',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'Large-format SUGAR Cosmetics branding and display panels in a mall atrium.',
    photos: ['sugar-mall-branding'],
    serviceSlugs: ['btl', 'atl'],
  },
  {
    slug: 'grofers-stall',
    client: 'Grofers',
    title: 'Corporate stall',
    eventType: 'BRAND_ACTIVATION',
    city: '[City]',
    eventDate: day(2020), // approx.
    summary: 'A Grofers stall at a corporate campus, with branding and a promoter team.',
    photos: ['grofers-stall'],
    serviceSlugs: ['btl'],
  },
  {
    slug: 'decor-and-experiences',
    client: '[Client]',
    title: 'Décor and experiential set-ups',
    eventType: 'CORPORATE',
    city: '[City]',
    eventDate: day(2018), // approx.
    summary: 'Fairy-light canopies, outdoor lounges, campus fests and fitness activations.',
    photos: ['fairy-light-venue', 'outdoor-lounge-decor', 'campus-fest', 'fitness-activation'],
    serviceSlugs: ['concept-execution', 'production'],
  },
];

// ── Testimonials, team, clients ──
// Quotes are verbatim from the previous site; the agency's former name is replaced with
// "[BRANDVISER]". Reviewer names and roles were never published.

const testimonials = [
  {
    company: 'Gates Foundation',
    quote:
      '[BRANDVISER] has been a vital partner in ensuring our global delegations and foreign partners experience seamless coordination while in India. Their expertise in managing complex logistics, from high-level conferences to specialized excursions, allows our leadership to focus entirely on our mission-driven dialogues. Their professionalism and attention to detail are exceptional.',
    isFeatured: true,
  },
  {
    company: 'Swiggy',
    quote:
      'We have been working with [BRANDVISER] for over few years now, the team is dedicated to every project we throw at them at any point of time. For one time hire for the city Marketing , now the team operates nearly in 300 cities across the country for various channels. Pratyush and team is very passionate in whatever they do. Keep up the good Work.',
    isFeatured: true,
  },
  {
    company: 'HSBC',
    quote:
      '[BRANDVISER] is team of young enthusiastic people. They offer service in good budget and their pro activeness throughout the event is amazing. The team is helpful and genuine puts in lot of efforts in every event we do.',
    isFeatured: true,
  },
  {
    company: 'Groww',
    quote:
      '[BRANDVISER] according to me is undoubtedly the best service provider in this segment. Their pro-active response, quality and timely delivery of commitments, reasonable commercials and trust make them much better from anyone else in the market. It’s always an awesome experience working with them. Kudos to the team.',
  },
  {
    company: 'Royaloak',
    quote:
      'We have been engaging with [BRANDVISER] for all BTL events and these guys have always been good & supportive in executing all the campaigns which we plan. Very economical pricing. Maintains good relationship with their clients. They also suggest different kind of marketing campaigns which works out well. One of the best event management companies in Bengaluru.',
  },
  {
    company: 'Fisher India',
    quote:
      'For our off-site events and resort-based meetings, [BRANDVISER] consistently delivers an experience that balances professional excellence with world-class hospitality. They have a unique talent for selecting the right venues and managing the complex logistics of hosting partners in diverse locations, ensuring every guest feels valued and inspired.',
  },
  {
    company: 'MOSIP – IIIT Bangalore',
    quote:
      '[BRANDVISER] consistently delivers premium, well-designed brand collateral and merchandise that our global community is proud to carry. Their ability to translate our brand values into tangible products is unmatched.',
  },
];

const team = [
  { name: 'Pratyush Kumar', role: 'Founder and Director' },
  { name: 'Jainendra Kumar', role: 'Director' },
];

/** Ordered for the logo strips: the first six show on most pages, the first four on Contact. */
const clientLogos: Array<[name: string, file: string]> = [
  ['Google', 'google.jpg'],
  ['Swiggy', 'swiggy.jpg'],
  ['HSBC', 'hsbc.jpg'],
  ['American Express', 'american-express.jpg'],
  ['Tata', 'tata.jpg'],
  ['Uber', 'uber.jpg'],
  ['Ola', 'ola.jpg'],
  ['Harley-Davidson', 'harley-davidson.jpg'],
  ['1mg', '1mg.jpg'],
  ['Grofers', 'grofers.jpg'],
  ['Udaan', 'udaan.jpg'],
  ['VLCC', 'vlcc.jpg'],
  ['Shriram Properties', 'shriram-properties.jpg'],
  ['Cuemath', 'cuemath.jpg'],
  ['FreshMenu', 'freshmenu.jpg'],
  ['NestAway', 'nestaway.jpg'],
  ['Bodycraft', 'bodycraft.jpg'],
  ['Shadowfax', 'shadowfax.jpg'],
  ['L&T Mutual Fund', 'lt-mutual-fund.png'],
  ['IIFL Mutual Fund', 'iifl-mutual-fund.jpg'],
  ['Mirae Asset', 'mirae-asset.png'],
  ['Hyperconnect', 'hyperconnect.png'],
  ['Logicserve', 'logicserve.jpg'],
  ['Sanjay Ghodawat Group', 'sanjay-ghodawat-group.jpg'],
  ['CNTC Hong Kong', 'cntc-hong-kong.jpg'],
];

const address = '#404, 1st Floor, 17th C Main Road, KHB Colony, Koramangala 5th Block, Bengaluru 560095';

async function main(): Promise<void> {
  await prisma.$transaction(async (tx) => {
    // Created once; later edits go through PATCH /api/v1/admin/site so re-seeding never overwrites them.
    await tx.siteSettings.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        description:
          'We curate meaningful experiences, from large-scale events to small branding projects, with attention to detail at planning and execution so clients get more than the ask.',
        phone: '+91 97314 49261',
        whatsapp: '[WhatsApp number]',
        email: 'info@firefoxproductions.in',
        address,
        hours: '[Opening hours]',
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        mapImageUrl: null,
        // Only stats BRANDVISER has published; the site hides empty ones.
        citiesCovered: 300,
        clientBrands: 50,
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
      data: (Object.entries(faqs) as Array<[keyof typeof faqs, Array<[string, string]>]>).flatMap(([page, items]) =>
        items.map(([question, answer], index) => ({ page, question, answer, sortOrder: index })),
      ),
    });

    for (const [index, { photos, serviceSlugs, ...caseStudy }] of caseStudies.entries()) {
      const [cover, ...gallery] = photos.map(photo);
      await tx.caseStudy.create({
        data: {
          ...caseStudy,
          body: `${caseStudy.summary}\n\n${detailsToConfirm}`,
          coverImageUrl: cover!,
          gallery,
          sortOrder: index,
          services: { connect: serviceSlugs.map((slug) => ({ slug })) },
        },
      });
    }

    await tx.testimonial.createMany({
      data: testimonials.map((testimonial, index) => ({
        ...testimonial,
        name: '[Name]',
        role: '[Role]',
        sortOrder: index,
      })),
    });

    await tx.teamMember.createMany({
      data: team.map((member, index) => ({ ...member, portraitUrl: null, sortOrder: index })),
    });

    await tx.clientLogo.createMany({
      data: clientLogos.map(([name, file], index) => ({ name, logoUrl: `/migrated/clients/${file}`, sortOrder: index })),
    });
    // Dozens of round trips: allow for a remote database, not just a local one.
  }, { timeout: 60_000, maxWait: 10_000 });

  const [serviceCount, caseStudyCount, logoCount] = await Promise.all([
    prisma.service.count(),
    prisma.caseStudy.count(),
    prisma.clientLogo.count(),
  ]);
  console.log(`Seeded ${serviceCount} services, ${caseStudyCount} case studies and ${logoCount} client logos.`);
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

