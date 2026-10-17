/**
 * API contract between @brandviserproductions/api and @brandviserproductions/web.
 * Type-only: both apps import it, so a shape change breaks the build on both sides.
 * Dates are ISO 8601 strings on the wire.
 */

// ── Enumerations (mirrored by Prisma enums; checked at compile time in the API mappers) ──

export type EventType = 'CORPORATE' | 'PRODUCT_LAUNCH' | 'CONFERENCE' | 'BRAND_ACTIVATION' | 'EXHIBITION';
export type AudienceSize = 'UNDER_100' | 'FROM_100_TO_500' | 'FROM_500_TO_2000' | 'OVER_2000';
export type BudgetRange = 'UNDER_5L' | 'FROM_5L_TO_15L' | 'FROM_15L_TO_50L' | 'OVER_50L' | 'NOT_SURE';
export type FaqPage = 'EXPERTISE' | 'CONTACT';
export type EnquirySource = 'HOME_QUICK' | 'CONTACT';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'WON' | 'LOST';

// ── Shared shapes ──

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageCount: number;
  limit: number;
}

export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
  error?: string;
  /** Validation failures keyed by request field (first message per field). */
  fields?: Record<string, string>;
}

// ── Site ──

export interface SiteStats {
  citiesCovered: number | null;
  clientBrands: number | null;
  eventsDelivered: number | null;
  yearsExperience: number | null;
  countriesCovered: number | null;
}

export interface ClientLogo {
  id: string;
  name: string;
  logoUrl: string | null;
}

export interface SiteInfo {
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  hours: string;
  mapUrl: string;
  mapImageUrl: string | null;
  stats: SiteStats;
  clientLogos: ClientLogo[];
}

// ── Services ──

export interface Service {
  id: string;
  slug: string;
  number: string;
  name: string;
  shortName: string;
  line: string;
  description: string;
  deliverables: string[];
  imageUrl: string | null;
}

export interface ServiceMatrixRow {
  eventType: EventType;
  label: string;
  serviceSlugs: string[];
}

export interface ServiceMatrix {
  services: Array<Pick<Service, 'slug' | 'shortName'>>;
  rows: ServiceMatrixRow[];
}

// ── Process ──

export interface ProcessStep {
  id: string;
  number: string;
  name: string;
  line: string;
  detail: string;
  deliverable: string;
  duration: string | null;
}

// ── Case studies (gallery) ──

export interface ServiceTag {
  slug: string;
  shortName: string;
}

export interface CaseStudySummary {
  id: string;
  slug: string;
  client: string;
  title: string;
  eventType: EventType;
  city: string;
  year: number;
  coverImageUrl: string;
  services: ServiceTag[];
  isFeatured: boolean;
}

export interface CaseStudyDetail extends CaseStudySummary {
  summary: string;
  body: string;
  eventDate: string;
  gallery: string[];
  attendees: number | null;
  citiesCount: number | null;
  days: number | null;
  testimonial: Testimonial | null;
}

export interface CaseStudyQuery {
  type?: EventType;
  service?: string;
  city?: string;
  year?: number;
  featured?: boolean;
  page?: number;
  limit?: number;
}

export interface CaseStudyFacets {
  totalEvents: number;
  totalCities: number;
  cities: string[];
  years: number[];
  services: ServiceTag[];
  eventTypes: Array<{ value: EventType; label: string }>;
}

// ── Social proof, team, FAQ ──

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  portraitUrl: string | null;
}

export interface Faq {
  id: string;
  question: string;
  answer: string;
}

// ── Enquiries ──

export interface CreateEnquiryRequest {
  services: string[];
  eventType?: EventType;
  city?: string;
  eventMonth?: string;
  audienceSize?: AudienceSize;
  budgetRange?: BudgetRange;
  name: string;
  company: string;
  email: string;
  phone: string;
  brief?: string;
  attachmentUrl?: string;
  attachmentName?: string;
  consent: true;
  /** Honeypot. Real users never fill it. */
  website?: string;
}

export interface QuickEnquiryRequest {
  name: string;
  phone: string;
  eventType: EventType;
  website?: string;
}

export interface EnquiryCreated {
  reference: string;
  schedulerUrl: string | null;
}

export interface EnquiryAdminView {
  id: string;
  reference: string;
  source: EnquirySource;
  status: EnquiryStatus;
  services: string[];
  eventType: EventType | null;
  city: string | null;
  eventMonth: string | null;
  audienceSize: AudienceSize | null;
  budgetRange: BudgetRange | null;
  name: string;
  company: string | null;
  email: string | null;
  phone: string;
  brief: string | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  createdAt: string;
}

// ── Labels shared by the UI and the notification email ──

export type LabelMap<K extends string> = Readonly<Record<K, string>>;
