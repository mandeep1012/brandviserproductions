/**
 * Copy for About & Process that changes rarely enough to live in code.
 * Bracketed text is a placeholder for BRANDVISER to supply before launch.
 */
export const about = {
  intro: {
    eyebrow: 'About BRANDVISER',
    title: 'Extraordinary events for private and corporate clients.',
    text: '[Origin story, two to three sentences: when BRANDVISER was founded, by whom, and why.]',
    imageUrl: null as string | null,
  },
  story: {
    title: 'Client-focused, with a creative twist.',
    paragraphs: [
      '[Paragraph one: what BRANDVISER believes about events and brand storytelling.]',
      '[Paragraph two: the team, its combined experience and how it is organised.]',
      '[Paragraph three: reach, vendor network and in-house production.]',
    ],
    founderQuote: '[Founder quote, one or two sentences.]',
    founderName: '[Founder name]',
  },
  whyClientsStay: [
    { title: 'Pan-India reach', text: 'One team and one standard across metros and smaller cities.' },
    { title: 'In-house production', text: 'Fabrication and AV under our control, not subcontracted blind.' },
    { title: 'Single point of contact', text: 'One accountable lead from brief to report.' },
    { title: 'Transparent costing', text: 'Itemised budgets agreed before work starts.' },
    { title: 'Vetted vendor network', text: 'Venues, talent and suppliers we have worked with before.' },
    { title: 'On-ground teams', text: 'Trained supervisors and promoters at every location.' },
  ],
} as const;
