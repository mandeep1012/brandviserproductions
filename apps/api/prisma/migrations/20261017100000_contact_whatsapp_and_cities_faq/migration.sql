-- WhatsApp is the same number as the phone line (confirmed by BRANDVISER, October 2026).
-- Only replaces the seed placeholder, so a number set later through the admin API is never overwritten.
UPDATE "SiteSettings"
SET "whatsapp" = "phone",
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "id" = 1 AND "whatsapp" = '[WhatsApp number]';

-- Keep the "Which cities do you cover?" answer in line with the 400+ cities headline stat.
UPDATE "Faq"
SET "answer" = REPLACE("answer", 'over 300 cities', 'over 400 cities'),
    "updatedAt" = CURRENT_TIMESTAMP
WHERE "answer" LIKE '%over 300 cities%';
