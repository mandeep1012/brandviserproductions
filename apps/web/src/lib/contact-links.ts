/** Builds tel: and wa.me links from display numbers like "+91 98765 43210". */
const digits = (value: string) => value.replace(/[^\d+]/g, '');

export const telHref = (phone: string) => `tel:${digits(phone)}`;
export const whatsappHref = (number: string) => `https://wa.me/${digits(number).replace(/^\+/, '')}`;
export const mailHref = (email: string) => `mailto:${email}`;

/** Placeholder values from the seed are bracketed; don't turn those into dead links. */
export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value.trim());

/** True when two display numbers are the same line, e.g. a WhatsApp number that is also the phone number. */
export const sameNumber = (a: string, b: string) => digits(a) !== '' && digits(a) === digits(b);

/** True for a real, confirmed value: not empty and not a bracketed placeholder. Use it to hide unconfirmed content. */
export const hasValue = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim() !== '' && !isPlaceholder(value);
