import type { Enquiry } from '../../generated/prisma/client.js';
import { AUDIENCE_SIZE_LABELS, BUDGET_RANGE_LABELS, EVENT_TYPE_LABELS } from '../../common/labels.js';

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

/** Label/value rows for the notification, skipping empty answers. */
export function enquiryRows(enquiry: Enquiry): Array<[string, string]> {
  const rows: Array<[string, string | null | undefined]> = [
    ['Reference', enquiry.reference],
    ['Source', enquiry.source === 'HOME_QUICK' ? 'Home page quick form' : 'Contact page'],
    ['Name', enquiry.name],
    ['Company', enquiry.company],
    ['Email', enquiry.email],
    ['Phone', enquiry.phone],
    ['Services', enquiry.serviceSlugs.join(', ')],
    ['Event type', enquiry.eventType && EVENT_TYPE_LABELS[enquiry.eventType]],
    ['City', enquiry.city],
    ['Date or month', enquiry.eventMonth],
    ['Audience size', enquiry.audienceSize && AUDIENCE_SIZE_LABELS[enquiry.audienceSize]],
    ['Budget range', enquiry.budgetRange && BUDGET_RANGE_LABELS[enquiry.budgetRange]],
    ['Brief', enquiry.brief],
    ['Attachment', enquiry.attachmentName],
  ];
  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}

export function enquirySubject(enquiry: Enquiry): string {
  const who = enquiry.company ? `${enquiry.name}, ${enquiry.company}` : enquiry.name;
  return `New enquiry ${enquiry.reference ?? ''} from ${who}`.replace(/\s+/g, ' ');
}

export function enquiryText(enquiry: Enquiry): string {
  return enquiryRows(enquiry)
    .map(([label, value]) => `${label}: ${value}`)
    .join('\n');
}

export function enquiryHtml(enquiry: Enquiry): string {
  const rows = enquiryRows(enquiry)
    .map(
      ([label, value]) =>
        `<tr><th align="left" style="padding:6px 16px 6px 0;color:#5B6470;font-weight:500;vertical-align:top">${escapeHtml(label)}</th>` +
        `<td style="padding:6px 0;white-space:pre-wrap">${escapeHtml(value)}</td></tr>`,
    )
    .join('');
  return `<div style="font-family:system-ui,sans-serif;font-size:15px;color:#14181F"><h2 style="font-weight:600">New website enquiry</h2><table cellspacing="0">${rows}</table></div>`;
}
