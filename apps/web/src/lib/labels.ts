import type { AudienceSize, BudgetRange, EventType } from '@brandviserproductions/contracts';

/** Identical copy of apps/api/src/common/labels.ts (the contracts package is type-only). */
export const EVENT_TYPE_LABELS: Readonly<Record<EventType, string>> = {
  CORPORATE: 'Corporate event',
  PRODUCT_LAUNCH: 'Product launch',
  CONFERENCE: 'Conference',
  BRAND_ACTIVATION: 'Brand activation',
  EXHIBITION: 'Exhibition',
};

/** Gallery tab labels, as drawn in the wireframe. */
export const EVENT_TYPE_TABS: ReadonlyArray<{ value: EventType; label: string }> = [
  { value: 'CORPORATE', label: 'Corporate' },
  { value: 'PRODUCT_LAUNCH', label: 'Launches' },
  { value: 'BRAND_ACTIVATION', label: 'Activations' },
  { value: 'CONFERENCE', label: 'Conferences' },
  { value: 'EXHIBITION', label: 'Exhibitions' },
];

/** Short tag shown on gallery tiles. */
export const EVENT_TYPE_TAGS: Readonly<Record<EventType, string>> = {
  CORPORATE: 'Corporate',
  PRODUCT_LAUNCH: 'Launch',
  CONFERENCE: 'Conference',
  BRAND_ACTIVATION: 'Activation',
  EXHIBITION: 'Exhibition',
};

export const AUDIENCE_SIZE_LABELS: Readonly<Record<AudienceSize, string>> = {
  UNDER_100: 'Under 100',
  FROM_100_TO_500: '100–500',
  FROM_500_TO_2000: '500–2,000',
  OVER_2000: 'Over 2,000',
};

export const BUDGET_RANGE_LABELS: Readonly<Record<BudgetRange, string>> = {
  UNDER_5L: 'Under ₹5 lakh',
  FROM_5L_TO_15L: '₹5–15 lakh',
  FROM_15L_TO_50L: '₹15–50 lakh',
  OVER_50L: 'Over ₹50 lakh',
  NOT_SURE: 'Not sure yet',
};

export const EVENT_TYPES = Object.keys(EVENT_TYPE_LABELS) as EventType[];
export const AUDIENCE_SIZES = Object.keys(AUDIENCE_SIZE_LABELS) as AudienceSize[];
export const BUDGET_RANGES = Object.keys(BUDGET_RANGE_LABELS) as BudgetRange[];
