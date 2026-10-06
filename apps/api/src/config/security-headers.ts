import type { RequestHandler } from 'express';
import {
  contentSecurityPolicy,
  crossOriginOpenerPolicy,
  crossOriginResourcePolicy,
  originAgentCluster,
  referrerPolicy,
  strictTransportSecurity,
  xContentTypeOptions,
  xDnsPrefetchControl,
  xDownloadOptions,
  xFrameOptions,
  xPermittedCrossDomainPolicies,
  xPoweredBy,
  xXssProtection,
} from 'helmet';

/**
 * Helmet's default middleware set, composed from its named exports.
 *
 * The default `helmet()` export is not used because helmet ships separate CJS/ESM typings and
 * Vercel's NestJS builder resolves the CJS ones for this ESM package, where the default import
 * types as a non-callable namespace (TS2349). Named exports type the same either way.
 */
export const securityHeaders: RequestHandler[] = [
  contentSecurityPolicy(),
  crossOriginOpenerPolicy(),
  crossOriginResourcePolicy(),
  originAgentCluster(),
  referrerPolicy(),
  strictTransportSecurity(),
  xContentTypeOptions(),
  xDnsPrefetchControl(),
  xDownloadOptions(),
  xFrameOptions(),
  xPermittedCrossDomainPolicies(),
  xPoweredBy(),
  xXssProtection(),
];
