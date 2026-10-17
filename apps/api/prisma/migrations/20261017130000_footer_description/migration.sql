-- Footer line under the BRANDVISER logo, confirmed by BRANDVISER (October 2026).
-- Only replaces the previous line, so a description set later through the admin API is never overwritten.
UPDATE "SiteSettings"
SET "description" = E'Experiences. Spaces. People. Impact.\nEvery detail designed, built and delivered by one accountable team.',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 1 AND "description" = 'We curate meaningful experiences, from large-scale events to small branding projects, with attention to detail at planning and execution so clients get more than the ask.';
