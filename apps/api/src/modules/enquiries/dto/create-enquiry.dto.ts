import {
  ArrayMaxSize,
  ArrayUnique,
  Equals,
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
  MaxLength,
} from 'class-validator';
import type { CreateEnquiryRequest } from '@brandviserproductions/contracts';
import { AudienceSize, BudgetRange, EventType } from '../../../generated/prisma/enums.js';
import { EmptyToUndefined, IsBriefBlobUrl, PHONE_PATTERN, Trim } from './enquiry-rules.js';

/** POST /enquiries: the two-part Contact & Booking form. */
export class CreateEnquiryDto implements CreateEnquiryRequest {
  // 1 · Your event
  @IsArray()
  @ArrayMaxSize(5)
  @ArrayUnique()
  @IsString({ each: true })
  @Matches(/^[a-z0-9-]{1,80}$/, { each: true })
  services: string[] = [];

  @IsOptional()
  @IsEnum(EventType, { message: 'Choose an event type from the list' })
  eventType?: EventType;

  @IsOptional()
  @EmptyToUndefined()
  @IsString()
  @MaxLength(80)
  city?: string;

  @IsOptional()
  @EmptyToUndefined()
  @IsString()
  @MaxLength(40)
  eventMonth?: string;

  @IsOptional()
  @IsEnum(AudienceSize, { message: 'Choose an audience size from the list' })
  audienceSize?: AudienceSize;

  @IsOptional()
  @IsEnum(BudgetRange, { message: 'Choose a budget range from the list' })
  budgetRange?: BudgetRange;

  // 2 · Your details
  @Trim()
  @IsString()
  @Length(2, 120, { message: 'Enter your name' })
  name!: string;

  @Trim()
  @IsString()
  @Length(1, 120, { message: 'Enter your company' })
  company!: string;

  @Trim()
  @IsEmail({}, { message: 'Enter a valid work email' })
  @MaxLength(160)
  email!: string;

  @Trim()
  @Matches(PHONE_PATTERN, { message: 'Enter a valid phone number' })
  phone!: string;

  @IsOptional()
  @EmptyToUndefined()
  @IsString()
  @MaxLength(5_000)
  brief?: string;

  @IsOptional()
  @IsBriefBlobUrl()
  attachmentUrl?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  attachmentName?: string;

  @Equals(true, { message: 'Please agree to be contacted about this enquiry' })
  consent!: true;

  /** Honeypot: hidden from people, filled by bots. */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
