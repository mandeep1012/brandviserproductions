import { z } from 'zod';
import type { CreateEnquiryRequest, QuickEnquiryRequest } from '@brandviserproductions/contracts';
import { AUDIENCE_SIZES, BUDGET_RANGES, EVENT_TYPES } from '../labels';

/** Mirrors apps/api/src/modules/enquiries/dto. The API validates again; this is for instant feedback. */
const PHONE = /^\+?[0-9 ()-]{7,20}$/;

const optionalEnum = <T extends string>(values: readonly T[]) =>
  z.union([z.enum(values as [T, ...T[]]), z.literal('')]);

export const enquirySchema = z.object({
  services: z.array(z.string()).max(5),
  eventType: optionalEnum(EVENT_TYPES),
  city: z.string().trim().max(80, 'Keep the city under 80 characters'),
  eventMonth: z.string().trim().max(40, 'Keep this under 40 characters'),
  audienceSize: optionalEnum(AUDIENCE_SIZES),
  budgetRange: optionalEnum(BUDGET_RANGES),
  name: z.string().trim().min(2, 'Enter your name').max(120),
  company: z.string().trim().min(1, 'Enter your company').max(120),
  email: z.string().trim().pipe(z.email('Enter a valid work email')),
  phone: z.string().trim().regex(PHONE, 'Enter a valid phone number'),
  brief: z.string().trim().max(5000, 'Keep the brief under 5,000 characters'),
  consent: z.boolean().refine((value) => value, 'Please agree to be contacted about this enquiry'),
  website: z.string(),
});

export type EnquiryFormValues = z.infer<typeof enquirySchema>;

/** Fields shown in "1 · Your event"; validated before the mobile form moves to step 2. */
export const STEP_ONE_FIELDS = ['services', 'eventType', 'city', 'eventMonth', 'audienceSize', 'budgetRange'] as const;

export const enquiryDefaults: EnquiryFormValues = {
  services: [],
  eventType: '',
  city: '',
  eventMonth: '',
  audienceSize: '',
  budgetRange: '',
  name: '',
  company: '',
  email: '',
  phone: '',
  brief: '',
  consent: false,
  website: '',
};

const orUndefined = <T extends string>(value: T | '') => (value === '' ? undefined : value);

export function toEnquiryRequest(
  values: EnquiryFormValues,
  attachment: { url: string; name: string } | null,
): CreateEnquiryRequest {
  return {
    services: values.services,
    eventType: orUndefined(values.eventType),
    city: orUndefined(values.city),
    eventMonth: orUndefined(values.eventMonth),
    audienceSize: orUndefined(values.audienceSize),
    budgetRange: orUndefined(values.budgetRange),
    name: values.name,
    company: values.company,
    email: values.email,
    phone: values.phone,
    brief: orUndefined(values.brief),
    attachmentUrl: attachment?.url,
    attachmentName: attachment?.name,
    consent: true,
    website: orUndefined(values.website),
  };
}

export const quickEnquirySchema = z.object({
  name: z.string().trim().min(2, 'Enter your name').max(120),
  phone: z.string().trim().regex(PHONE, 'Enter a valid phone number'),
  eventType: z.union([z.enum(EVENT_TYPES as [string, ...string[]]), z.literal('')]).refine((v) => v !== '', 'Choose an event type'),
  website: z.string(),
});

export type QuickEnquiryFormValues = z.infer<typeof quickEnquirySchema>;

export function toQuickEnquiryRequest(values: QuickEnquiryFormValues): QuickEnquiryRequest {
  return {
    name: values.name,
    phone: values.phone,
    eventType: values.eventType as QuickEnquiryRequest['eventType'],
    website: values.website || undefined,
  };
}
