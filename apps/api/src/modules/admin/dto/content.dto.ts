import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { EventType, FaqPage } from '../../../generated/prisma/enums.js';

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Fields every orderable, publishable content row shares. */
class Publishable {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  sortOrder?: number;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}

// ── Case studies ──

export class CreateCaseStudyDto extends Publishable {
  @Matches(SLUG)
  @Length(1, 120)
  slug!: string;

  @IsString()
  @Length(1, 120)
  client!: string;

  @IsString()
  @Length(1, 160)
  title!: string;

  @IsEnum(EventType)
  eventType!: EventType;

  @IsString()
  @Length(1, 80)
  city!: string;

  /** YYYY-MM-DD */
  @IsDateString({ strict: true })
  eventDate!: string;

  @IsString()
  @Length(1, 400)
  summary!: string;

  @IsString()
  body!: string;

  @IsUrl()
  coverImageUrl!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(40)
  @IsUrl({}, { each: true })
  gallery?: string[];

  @IsOptional()
  @IsInt()
  @Min(0)
  attendees?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  citiesCount?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  days?: number | null;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  /** Replaces the linked services. */
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @Matches(SLUG, { each: true })
  serviceSlugs?: string[];
}
export class UpdateCaseStudyDto extends PartialType(CreateCaseStudyDto) {}

// ── Testimonials ──

export class CreateTestimonialDto extends Publishable {
  @IsString()
  @Length(1, 2_000)
  quote!: string;

  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 120)
  role!: string;

  @IsString()
  @Length(1, 120)
  company!: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean;

  /** Links the quote to a case study; `null` unlinks it. */
  @IsOptional()
  @Matches(SLUG)
  caseStudySlug?: string | null;
}
export class UpdateTestimonialDto extends PartialType(CreateTestimonialDto) {}

// ── Team, logos, FAQs ──

export class CreateTeamMemberDto extends Publishable {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 120)
  role!: string;

  @IsOptional()
  @IsUrl()
  portraitUrl?: string | null;
}
export class UpdateTeamMemberDto extends PartialType(CreateTeamMemberDto) {}

export class CreateClientLogoDto extends Publishable {
  @IsString()
  @Length(1, 120)
  name!: string;

  @IsOptional()
  @IsUrl()
  logoUrl?: string | null;
}
export class UpdateClientLogoDto extends PartialType(CreateClientLogoDto) {}

export class CreateFaqDto extends Publishable {
  @IsEnum(FaqPage)
  page!: FaqPage;

  @IsString()
  @Length(1, 200)
  question!: string;

  @IsString()
  @Length(1, 4_000)
  answer!: string;
}
export class UpdateFaqDto extends PartialType(CreateFaqDto) {}

// ── Services and process ──

export class CreateServiceDto extends Publishable {
  @Matches(SLUG)
  @Length(1, 80)
  slug!: string;

  @Matches(/^\d{2}$/)
  number!: string;

  @IsString()
  @Length(1, 120)
  name!: string;

  @IsString()
  @Length(1, 40)
  shortName!: string;

  @IsString()
  @Length(1, 200)
  line!: string;

  @IsString()
  description!: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  deliverables?: string[];

  @IsOptional()
  @IsUrl()
  imageUrl?: string | null;

  /** Rows of the event-type matrix this service is ticked in. Replaces the current set. */
  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsEnum(EventType, { each: true })
  eventTypes?: EventType[];
}
export class UpdateServiceDto extends PartialType(CreateServiceDto) {}

export class CreateProcessStepDto {
  @Matches(/^\d{2}$/)
  number!: string;

  @IsString()
  @Length(1, 80)
  name!: string;

  @IsString()
  @Length(1, 200)
  line!: string;

  @IsString()
  detail!: string;

  @IsString()
  @Length(1, 120)
  deliverable!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  duration?: string | null;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
export class UpdateProcessStepDto extends PartialType(CreateProcessStepDto) {}

// ── Site settings ──

export class UpdateSiteDto {
  @IsOptional() @IsString() @MaxLength(280) description?: string;
  @IsOptional() @IsString() @MaxLength(40) phone?: string;
  @IsOptional() @IsString() @MaxLength(40) whatsapp?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(280) address?: string;
  @IsOptional() @IsString() @MaxLength(160) hours?: string;
  @IsOptional() @IsUrl() mapUrl?: string;
  @IsOptional() @IsUrl() mapImageUrl?: string | null;
  @IsOptional() @IsInt() @Min(0) citiesCovered?: number | null;
  @IsOptional() @IsInt() @Min(0) clientBrands?: number | null;
  @IsOptional() @IsInt() @Min(0) eventsDelivered?: number | null;
  @IsOptional() @IsInt() @Min(0) yearsExperience?: number | null;
  @IsOptional() @IsInt() @Min(0) countriesCovered?: number | null;
}
