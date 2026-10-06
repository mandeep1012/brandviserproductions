/**
 * Copy for About & Process that changes rarely enough to live in code. Migrated from BRANDVISER's
 * previous website; bracketed text is a placeholder for BRANDVISER to supply before launch.
 */
export const about = {
  intro: {
    eyebrow: 'Who we are',
    title: 'Creating extraordinary events for private and corporate clients.',
    text: 'BRANDVISER was born out of a desire to create a truly client-focused agency with a strong creative twist. The business was founded in 2013 by Pratyush Kumar, with a team picked for their obsession with the industry, their experience and their dedication to events.',
    imageUrl: '/migrated/gallery/conference-ballroom-stage.jpg' as string | null,
  },
  story: {
    title: 'Client-focused, with a creative twist.',
    paragraphs: [
      'At BRANDVISER we go the extra mile to deliver excellence in every event we produce. We help plan everything from start to finish and take the stress away from you. Organising events is our life, and we love what we do.',
      'We believe advertising is happiness. We start by sitting down with you to understand the requirement and objective of your event, then deliver creative, exciting and spot-on solutions. From product launches and brand exhibitions to RWA and corporate activations and mall branding, every event is different, but our ethos stays the same: we design for impact and we love detail, because detail is what everyone remembers.',
      'Many of our client relationships span more than half a decade. We believe that is testament to our ability to consistently deliver high-quality, unique events, and our aim is always to meet your company’s objectives and values.',
    ],
    founderQuote: '[Founder quote, one or two sentences.]',
    founderName: 'Pratyush Kumar',
  },
  whyClientsStay: [
    { title: 'Process-driven approach', text: 'Meet & agree, idea & concept, design & create, build & execute: the same four steps every time.' },
    { title: 'Creative support', text: 'Creative, exciting and spot-on ideas, from the theme to the smallest detail.' },
    { title: 'SME access', text: 'Specialists for each kind of event, from conferences to retail activations.' },
    { title: 'Pan-India presence', text: 'Campaigns run in over 300 cities, with print support across 600 locations.' },
    { title: 'Cost-efficient solutions', text: 'Economical pricing that keeps the impact high and the budget in check.' },
    { title: 'High-quality execution', text: 'We only get one chance to get it right, so we never underestimate production.' },
  ],
} as const;
