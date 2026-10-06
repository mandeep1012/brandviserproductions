/** Builds tel: and wa.me links from display numbers like "+91 98765 43210". */
const digits = (value: string) => value.replace(/[^\d+]/g, '');

export const telHref = (phone: string) => `tel:${digits(phone)}`;
export const whatsappHref = (number: string) => `https://wa.me/${digits(number).replace(/^\+/, '')}`;
export const mailHref = (email: string) => `mailto:${email}`;

/** Placeholder values from the seed are bracketed; don't turn those into dead links. */
export const isPlaceholder = (value: string) => /^\[.*\]$/.test(value.trim());
