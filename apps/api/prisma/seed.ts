/**
 * Seeds the site content. Services follow BRANDVISER's website content sheet ("Final Our Services").
 * Process, testimonials, client logos, gallery photography, team and contact details are migrated
 * from BRANDVISER's previous website (firefoxproductions.in) and public company records. Bracketed text is a placeholder for what only BRANDVISER can confirm
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
    slug: 'events-experiential',
    number: '01',
    name: 'Events & Experiential',
    shortName: 'Experiential',
    line: 'Brand activations, launches and immersive experiences, designed around your objectives.',
    description:
      'Exceptional events happen by design, not by chance. We bridge the gap between business objectives and creative disruption: pop-up shops, mobile tours, interactive booths and brand installations, captured on camera and amplified online so the story lives on long after the lights dim.',
    deliverables: [
      'Concept development and strategy',
      'Immersive event production',
      'Brand activations: sampling, roadshows, RWA, mall and metro branding',
      'Product launches and live demos',
      'Gamified engagement',
      'Content creation, capture and amplification',
      'Merchandise and swag',
      'Print media solutions',
    ],
    imageUrl: '/migrated/services/btl.jpg',
  },
  {
    slug: 'corporate-events',
    number: '02',
    name: 'Corporate Event Services',
    shortName: 'Corporate',
    line: 'Internal and external events: family days, employee meets, dealer meets and launches.',
    description:
      'Internal events that lift morale and strengthen company culture, and external events that build relationships and business. From family days and annual employee meets to dealer meets, networking evenings and product launches, we run everything from start to finish.',
    deliverables: [
      'Family days and sports days',
      'Annual employee meets and gala dinners',
      'Team building and training',
      'Onsite celebrations at offices',
      'Networking and social events',
      'Dealer meets',
      'Product launches',
      'Conferences, seminars and CSR events',
    ],
    imageUrl: photo('visa-btc-stage'),
  },
  {
    slug: 'business-conferences',
    number: '03',
    name: 'Business Conferences & Team Offsites',
    shortName: 'Conferences',
    line: 'Venue sourcing, delegate management and conference production, in India and abroad.',
    description:
      'We source venues through a stringent RFQ process to get competitive bids from business centres, hotels and resorts, then handle theme and branding, delegate registration, hotels and travel. On the day, we deliver world-class conference production and engagement that keeps every session lively.',
    deliverables: [
      'Venue sourcing',
      'Theme and branding',
      'Delegate registration',
      'Conference production and AV',
      'Hotel and travel services',
      'Gamified engagement activities',
      'Artist management',
      'Gala awards ceremonies',
    ],
    imageUrl: '/migrated/services/concept-execution.jpg',
  },
  {
    slug: 'mice-international',
    number: '04',
    name: 'International MICE',
    shortName: 'MICE',
    line: 'Meetings, incentives, conferences and retreats at destinations worldwide.',
    description:
      'We take your teams and partners abroad and handle the details: flights, visas, hotels at competitive rates and ground transport, with the safety and well-being of every traveller in mind. Our destination guides help you pick the right location, then we plan the conference, celebrations, excursions and dining around it.',
    deliverables: [
      'Travel management',
      'Visa assistance and flight bookings',
      'Hotel selection',
      'Conferences and retreats',
      'Milestone celebrations',
      'Destination guides',
      'Sightseeing, excursions and dining experiences',
      'Team building and gala awards',
    ],
    imageUrl: photo('delegation-2024-banquet'),
  },
];

/** "What each event type draws on". Indicative; confirm against BRANDVISER's real service mix. */
const matrix: Record<EventType, string[]> = {
  CORPORATE: ['corporate-events', 'business-conferences', 'mice-international'],
  PRODUCT_LAUNCH: ['events-experiential', 'corporate-events'],
  CONFERENCE: ['corporate-events', 'business-conferences', 'mice-international'],
  BRAND_ACTIVATION: ['events-experiential'],
  EXHIBITION: ['events-experiential'],
};

const processSteps = [
  {
    number: '01',
    name: 'Insight',
    line: 'The brief, the audience, the budget and the one number that defines success.',
    detail: 'The brief, the audience, the budget and the one number that defines success.',
    deliverable: 'Signed-off brief',
  },
  {
    number: '02',
    name: 'Imagination',
    line: 'Concept, design, 3D renders and a fully costed plan.',
    detail: 'Concept, design, 3D renders and a fully costed plan.',
    deliverable: 'Concept deck',
  },
  {
    number: '03',
    name: 'Orchestration',
    line: 'Venues, vendors, fabrication, talent and full rehearsals.',
    detail: 'Venues, vendors, fabrication, talent and full rehearsals.',
    deliverable: 'Designs and budget',
  },
  {
    number: '04',
    name: 'Impact',
    line: 'An experience that feels effortless in the moment and memorable long after.',
    detail: 'An experience that feels effortless in the moment and memorable long after.',
    deliverable: 'Event and report',
  },
];

const citiesAnswer =
  'We work across India. Our teams have run campaigns in over 400 cities, and our print support covers 600 locations across the country at no extra cost.';

const faqs: Record<'EXPERTISE' | 'CONTACT', Array<[question: string, answer: string]>> = {
  EXPERTISE: [
    ['How much lead time do you need?', '[Answer]'],
    ['Which cities do you cover?', citiesAnswer],
    ['Can you work with our existing vendors?', '[Answer]'],
    ['Do you handle permissions and licences?', '[Answer]'],
    ['How is the budget structured?', '[Answer]'],
    ['What do we receive after the event?', '[Answer]'],
  ],
  // Confirmed by BRANDVISER (October 2026).
  CONTACT: [
    [
      'Do you handle everything end to end, from concept to on-ground execution?',
      'Absolutely. From concept creation and design to planning, manpower, and on-ground execution, we manage every detail end to end. Our disciplined team works like your on-site concierge, ensuring a seamless experience so you can relax and focus on what matters most.',
    ],
    [
      'Can you run multi-city rollouts at the same time?',
      'Yes. We orchestrate multi-city launches, brand expansion, and large-scale activation rollouts simultaneously, delivering consistent brand experiences, seamless coordination, and precision-led execution across every market.',
    ],
    [
      'Do you manage international travel, visas and destination logistics?',
      'Absolutely. We manage end-to-end international travel, visa coordination, luxury accommodations, transfers, and destination logistics, ensuring every detail is seamlessly orchestrated for a smooth, stress-free experience across borders.',
    ],
    [
      'Which cities do you cover?',
      'We have a pan-India execution network spanning 400+ cities, covering all major Tier 1 markets alongside a strong presence across Tier 2 and Tier 3 cities. Wherever your brand needs to be, we bring local expertise, seamless coordination, and consistent execution.',
    ],
    [
      'Do you have your own printing unit?',
      'Yes. Our in-house printing capabilities ensure precision, consistency, and quality across all event collaterals and branding materials, with meticulous quality control checks at every stage.',
    ],
    [
      'How do you make sure everything runs smoothly on the day?',
      'Through meticulous planning, detailed run sheets, proactive coordination, and real-time on-ground management, we stay ahead of every detail. Our experienced team anticipates challenges, resolves them swiftly, and ensures every moment unfolds seamlessly, just as envisioned.',
    ],
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
    serviceSlugs: ['corporate-events'],
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
    serviceSlugs: ['business-conferences'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['business-conferences', 'mice-international'],
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
    serviceSlugs: ['corporate-events'],
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
    serviceSlugs: ['corporate-events'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential', 'corporate-events'],
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
    serviceSlugs: ['corporate-events'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['business-conferences'],
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
    serviceSlugs: ['business-conferences'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['corporate-events', 'events-experiential'],
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
    serviceSlugs: ['corporate-events'],
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
    serviceSlugs: ['corporate-events'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential'],
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
    serviceSlugs: ['events-experiential', 'corporate-events'],
  },
];

// ── Testimonials, team, clients ──
// Quotes and the company behind each are from the client's deck (PROJECT PRESENTATION, 2025),
// with the agency's name written "BRANDVISER". Reviewer names and roles were never published, so
// the site credits each quote with the company's logo, matched by name against `clientLogos`.
// Two deck quotes sit beside an empty image placeholder instead of a logo; they are left out.

const testimonials = [
  {
    company: 'HSBC',
    quote:
      'BRANDVISER is a team of young enthusiastic people. They offer service in good budget and their pro activeness throughout the event is amazing. The team is helpful and genuine puts in lot of efforts in every event we do.',
    isFeatured: true,
  },
  {
    company: 'Truefitt & Hill',
    quote:
      'BRANDVISER has been a vital partner in ensuring our global delegations and foreign partners experience seamless coordination while in India. Their expertise in managing complex logistics, from high-level conferences to specialized excursions, allows our leadership to focus entirely on our mission-driven dialogues. Their professionalism and attention to detail are exceptional.',
    isFeatured: true,
  },
  {
    company: 'CoinDCX',
    quote:
      'BRANDVISER has been an exceptional partner in supporting our international events, delivering seamlessly across branding, procurement, gifting, and on-ground execution. Their attention to detail, responsiveness, and ability to bring every requirement together have made them a truly dependable partner. We highly value their professionalism and the elevated experience they consistently deliver.',
    isFeatured: true,
  },
  {
    company: 'Swiggy',
    quote:
      'We have been working with BRANDVISER for over few years now, the team is dedicated to every project we throw at them at any point of time. For one time hire for the city Marketing, now the team operates nearly in 300 cities across the country for various channels. Pratyush and team is very passionate in whatever they do. Keep up the good Work.',
  },
  {
    company: 'Fischer',
    quote:
      'For our off-site events and resort-based meetings, BRANDVISER consistently delivers an experience that balances professional excellence with world-class hospitality. They have a unique talent for selecting the right venues and managing the complex logistics of hosting partners in diverse locations, ensuring every guest feels valued and inspired.',
  },
  {
    company: 'Royal Oak',
    quote:
      'We have been engaging with BRANDVISER for all BTL events and these guys have always been good & supportive in executing all the campaigns which we plan. Very economical pricing. Maintains good relationship with their clients. They also suggest different kind of marketing campaigns which works out well. One of the best event management companies in Bengaluru.',
  },
];

const team = [
  { name: 'Pratyush Kumar', role: 'Founder and Director' },
  { name: 'Jainendra Kumar', role: 'Director' },
];

/**
 * Ordered for the logo strips: the Home strip scrolls through all of them, Contact shows the first four.
 * The client's deck list leads; the clients carried over from the old site follow, in their current
 * colour logos (Logicserve is now LS Digital). Paths are under apps/web/public.
 */
const clientLogos: Array<[name: string, path: string]> = [
  ['HDFC Bank', '/client-logos/hdfc-bank.svg'],
  ['Visa', '/client-logos/visa.svg'],
  ['BMW Motorrad', '/client-logos/bmw-motorrad.svg'],
  ['Uber', '/client-logos/uber.svg'],
  ['Tata 1mg', '/client-logos/tata-1mg.png'],
  ['Gates Foundation', '/client-logos/gates-foundation.svg'],
  ['Ola', '/client-logos/ola.svg'],
  ['Groww', '/client-logos/groww.png'],
  ['Mirae Asset', '/client-logos/mirae-asset.svg'],
  ['CoinDCX', '/client-logos/coindcx.svg'],
  ['Porter', '/client-logos/porter.svg'],
  ['Swish', '/client-logos/swish.png'],
  ['Royal Oak', '/client-logos/royal-oak.png'],
  ['Truefitt & Hill', '/client-logos/truefitt-hill.png'],
  ['Bodycraft', '/client-logos/bodycraft.svg'],
  ['L&T Mutual Fund', '/client-logos/lt-mutual-fund.png'],
  ['Shriram Properties', '/client-logos/shriram-properties.png'],
  ['IIIT Bangalore', '/client-logos/iiit-bangalore.svg'],
  ['HSBC', '/client-logos/hsbc.svg'],
  ['Swiggy', '/client-logos/swiggy.png'],
  ['Fischer', '/client-logos/fischer.png'],
  ['Google', '/client-logos/google.svg'],
  ['American Express', '/client-logos/american-express.svg'],
  ['Harley-Davidson', '/client-logos/harley-davidson.svg'],
  ['Udaan', '/client-logos/udaan.png'],
  ['VLCC', '/client-logos/vlcc.png'],
  ['Shadowfax', '/client-logos/shadowfax.png'],
  ['IIFL', '/client-logos/iifl.png'],
  ['Sanjay Ghodawat Group', '/client-logos/sanjay-ghodawat-group.png'],
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
        description: 'Experiences. Spaces. People. Impact.\nEvery detail designed, built and delivered by one accountable team.',
        phone: '+91 97314 49261',
        whatsapp: '+91 97314 49261',
        email: 'pratyush@brandviserproductions.in',
        address,
        hours: '[Opening hours]',
        mapUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`,
        mapImageUrl: null,
        // Only stats BRANDVISER has published; the site hides empty ones.
        citiesCovered: 400,
        clientBrands: 75,
        eventsDelivered: 1000,
        yearsExperience: null,
        countriesCovered: 15,
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
      data: clientLogos.map(([name, logoUrl], index) => ({ name, logoUrl, sortOrder: index })),
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

