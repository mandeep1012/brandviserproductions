-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('CORPORATE', 'PRODUCT_LAUNCH', 'CONFERENCE', 'BRAND_ACTIVATION', 'EXHIBITION');

-- CreateEnum
CREATE TYPE "AudienceSize" AS ENUM ('UNDER_100', 'FROM_100_TO_500', 'FROM_500_TO_2000', 'OVER_2000');

-- CreateEnum
CREATE TYPE "BudgetRange" AS ENUM ('UNDER_5L', 'FROM_5L_TO_15L', 'FROM_15L_TO_50L', 'OVER_50L', 'NOT_SURE');

-- CreateEnum
CREATE TYPE "FaqPage" AS ENUM ('EXPERTISE', 'CONTACT');

-- CreateEnum
CREATE TYPE "EnquirySource" AS ENUM ('HOME_QUICK', 'CONTACT');

-- CreateEnum
CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST');

-- CreateTable
CREATE TABLE "SiteSettings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "description" VARCHAR(280) NOT NULL,
    "phone" VARCHAR(40) NOT NULL,
    "whatsapp" VARCHAR(40) NOT NULL,
    "email" VARCHAR(160) NOT NULL,
    "address" VARCHAR(280) NOT NULL,
    "hours" VARCHAR(160) NOT NULL,
    "mapUrl" TEXT NOT NULL,
    "mapImageUrl" TEXT,
    "citiesCovered" INTEGER,
    "clientBrands" INTEGER,
    "eventsDelivered" INTEGER,
    "yearsExperience" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientLogo" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "logoUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientLogo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(80) NOT NULL,
    "number" VARCHAR(4) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "shortName" VARCHAR(40) NOT NULL,
    "line" VARCHAR(200) NOT NULL,
    "description" TEXT NOT NULL,
    "deliverables" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventTypeOffering" (
    "eventType" "EventType" NOT NULL,
    "serviceId" TEXT NOT NULL,

    CONSTRAINT "EventTypeOffering_pkey" PRIMARY KEY ("eventType","serviceId")
);

-- CreateTable
CREATE TABLE "ProcessStep" (
    "id" TEXT NOT NULL,
    "number" VARCHAR(4) NOT NULL,
    "name" VARCHAR(80) NOT NULL,
    "line" VARCHAR(200) NOT NULL,
    "detail" TEXT NOT NULL,
    "deliverable" VARCHAR(120) NOT NULL,
    "duration" VARCHAR(60),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProcessStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CaseStudy" (
    "id" TEXT NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "client" VARCHAR(120) NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "eventType" "EventType" NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "eventDate" DATE NOT NULL,
    "summary" VARCHAR(400) NOT NULL,
    "body" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "attendees" INTEGER,
    "citiesCount" INTEGER,
    "days" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CaseStudy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "quote" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "role" VARCHAR(120) NOT NULL,
    "company" VARCHAR(120) NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "caseStudyId" TEXT,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "role" VARCHAR(120) NOT NULL,
    "portraitUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Faq" (
    "id" TEXT NOT NULL,
    "page" "FaqPage" NOT NULL,
    "question" VARCHAR(200) NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Faq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Enquiry" (
    "id" TEXT NOT NULL,
    "number" SERIAL NOT NULL,
    "reference" VARCHAR(20),
    "source" "EnquirySource" NOT NULL,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "serviceSlugs" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "eventType" "EventType",
    "city" VARCHAR(80),
    "eventMonth" VARCHAR(40),
    "audienceSize" "AudienceSize",
    "budgetRange" "BudgetRange",
    "name" VARCHAR(120) NOT NULL,
    "company" VARCHAR(120),
    "email" VARCHAR(160),
    "phone" VARCHAR(40) NOT NULL,
    "brief" TEXT,
    "attachmentUrl" TEXT,
    "attachmentName" VARCHAR(200),
    "consentAt" TIMESTAMP(3),
    "ipHash" VARCHAR(64),
    "userAgent" VARCHAR(300),
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Enquiry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CaseStudyToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CaseStudyToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "ClientLogo_isPublished_sortOrder_idx" ON "ClientLogo"("isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Service_slug_key" ON "Service"("slug");

-- CreateIndex
CREATE INDEX "Service_isPublished_sortOrder_idx" ON "Service"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "ProcessStep_sortOrder_idx" ON "ProcessStep"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "CaseStudy_slug_key" ON "CaseStudy"("slug");

-- CreateIndex
CREATE INDEX "CaseStudy_isPublished_eventType_eventDate_idx" ON "CaseStudy"("isPublished", "eventType", "eventDate");

-- CreateIndex
CREATE INDEX "CaseStudy_isPublished_isFeatured_idx" ON "CaseStudy"("isPublished", "isFeatured");

-- CreateIndex
CREATE INDEX "CaseStudy_isPublished_city_idx" ON "CaseStudy"("isPublished", "city");

-- CreateIndex
CREATE INDEX "Testimonial_isPublished_sortOrder_idx" ON "Testimonial"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "Testimonial_caseStudyId_idx" ON "Testimonial"("caseStudyId");

-- CreateIndex
CREATE INDEX "TeamMember_isPublished_sortOrder_idx" ON "TeamMember"("isPublished", "sortOrder");

-- CreateIndex
CREATE INDEX "Faq_page_isPublished_sortOrder_idx" ON "Faq"("page", "isPublished", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_number_key" ON "Enquiry"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Enquiry_reference_key" ON "Enquiry"("reference");

-- CreateIndex
CREATE INDEX "Enquiry_status_createdAt_idx" ON "Enquiry"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Enquiry_createdAt_idx" ON "Enquiry"("createdAt");

-- CreateIndex
CREATE INDEX "_CaseStudyToService_B_index" ON "_CaseStudyToService"("B");

-- AddForeignKey
ALTER TABLE "EventTypeOffering" ADD CONSTRAINT "EventTypeOffering_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_caseStudyId_fkey" FOREIGN KEY ("caseStudyId") REFERENCES "CaseStudy"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToService" ADD CONSTRAINT "_CaseStudyToService_A_fkey" FOREIGN KEY ("A") REFERENCES "CaseStudy"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CaseStudyToService" ADD CONSTRAINT "_CaseStudyToService_B_fkey" FOREIGN KEY ("B") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;
