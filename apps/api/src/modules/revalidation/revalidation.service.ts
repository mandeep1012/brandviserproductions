import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { waitUntil } from '@vercel/functions';
import type { Env } from '../../config/env.validation.js';

/** Cache tags understood by the web app's `/api/revalidate` route and its fetch calls. */
export type ContentTag =
  | 'site'
  | 'services'
  | 'process'
  | 'case-studies'
  | 'testimonials'
  | 'team'
  | 'faqs';

/**
 * After an admin write, asks the web app to drop its cached pages for the affected tags,
 * so edits appear immediately instead of after the 5-minute ISR window.
 */
@Injectable()
export class RevalidationService {
  private readonly logger = new Logger(RevalidationService.name);

  constructor(private readonly config: ConfigService<Env, true>) {}

  revalidate(...tags: ContentTag[]): void {
    const url = this.config.get('WEB_REVALIDATE_URL', { infer: true });
    const secret = this.config.get('REVALIDATE_SECRET', { infer: true });
    if (!url || !secret) return;
    waitUntil(
      fetch(url, {
        method: 'POST',
        headers: { authorization: `Bearer ${secret}`, 'content-type': 'application/json' },
        body: JSON.stringify({ tags }),
        signal: AbortSignal.timeout(5_000),
      })
        .then((res) => {
          if (!res.ok) this.logger.warn(`Revalidation returned ${res.status} for ${tags.join(', ')}`);
        })
        .catch((error: unknown) => this.logger.warn(`Revalidation failed: ${String(error)}`)),
    );
  }
}
