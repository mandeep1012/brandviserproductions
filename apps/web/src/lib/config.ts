/**
 * Public runtime configuration. NEXT_PUBLIC_* values are inlined at build time, so the
 * browser and the server read the same API origin.
 */
const trimSlash = (value: string) => value.replace(/\/+$/, '');

export const API_URL = trimSlash(process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000');
export const API_BASE = `${API_URL}/api/v1`;
export const SITE_URL = trimSlash(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
export const SCHEDULER_URL = process.env.NEXT_PUBLIC_SCHEDULER_URL || null;
export const HERO_VIDEO_URL = process.env.NEXT_PUBLIC_HERO_VIDEO_URL || null;

/** ISR window, in seconds. Matches the API's CDN `s-maxage`. */
export const REVALIDATE_SECONDS = 300;

export const SITE_NAME = 'BRANDVISER';
