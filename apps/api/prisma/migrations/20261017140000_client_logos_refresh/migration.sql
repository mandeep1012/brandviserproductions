-- Client logos, October 2026. BRANDVISER retired six logos from the site.
DELETE FROM "ClientLogo"
WHERE "name" IN ('NestAway', 'Hyperconnect', 'LS Digital', 'Grofers', 'Cuemath', 'FreshMenu');

-- The remaining logos move to /client-logos: the same artwork, cropped and optically sized so every
-- logo carries the same visual weight at one shared height. Logos uploaded later keep their own URL.
UPDATE "ClientLogo"
SET "logoUrl" = REPLACE("logoUrl", '/clients/', '/client-logos/'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "logoUrl" LIKE '/clients/%';
