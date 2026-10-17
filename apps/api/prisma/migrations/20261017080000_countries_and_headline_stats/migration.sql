-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN "countriesCovered" INTEGER;

-- Headline stats confirmed by BRANDVISER (October 2026): 400+ cities, 75+ brand clients,
-- 1,000+ projects delivered, 15+ countries. Later changes go through PATCH /api/v1/admin/site.
UPDATE "SiteSettings"
SET "citiesCovered" = 400,
    "clientBrands" = 75,
    "eventsDelivered" = 1000,
    "countriesCovered" = 15,
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 1;
