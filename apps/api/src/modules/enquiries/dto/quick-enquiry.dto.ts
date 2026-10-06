import { IsEnum, IsOptional, IsString, Length, Matches, MaxLength } from 'class-validator';
import type { QuickEnquiryRequest } from '@brandviserproductions/contracts';
import { EventType } from '../../../generated/prisma/enums.js';
import { PHONE_PATTERN, Trim } from './enquiry-rules.js';

/** POST /enquiries/quick: "Have a brief? Let's meet." on the home page. */
export class QuickEnquiryDto implements QuickEnquiryRequest {
  @Trim()
  @IsString()
  @Length(2, 120, { message: 'Enter your name' })
  name!: string;

  @Trim()
  @Matches(PHONE_PATTERN, { message: 'Enter a valid phone number' })
  phone!: string;

  @IsEnum(EventType, { message: 'Choose an event type' })
  eventType!: EventType;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  website?: string;
}
