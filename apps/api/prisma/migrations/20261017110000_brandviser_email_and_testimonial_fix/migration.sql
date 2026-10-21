-- BRANDVISER's own email replaces the address carried over from the previous website (confirmed October 2026).
-- Only replaces the old address, so an email set later through the admin API is never overwritten.
UPDATE "SiteSettings"
SET "email" = 'pratyush@brandviserproductions.in',
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 1 AND "email" = 'info@firefoxproductions.in';

-- Grammar fix in the HSBC testimonial ("is team of" -> "is a team of"), matching the seed.
UPDATE "Testimonial"
SET "quote" = REPLACE("quote", 'BRANDVISER is team of', 'BRANDVISER is a team of'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "quote" LIKE '%BRANDVISER is team of%';
