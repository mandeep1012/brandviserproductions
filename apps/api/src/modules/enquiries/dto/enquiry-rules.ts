import { Transform } from 'class-transformer';
import { registerDecorator, type ValidationOptions } from 'class-validator';

/** Digits, spaces and + ( ) - only, 7–20 characters: covers Indian and international formats. */
export const PHONE_PATTERN = /^\+?[0-9 ()-]{7,20}$/;

export const Trim = () =>
  Transform(({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value));

/** Empty strings from untouched optional inputs become `undefined`. */
export const EmptyToUndefined = () =>
  Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    return trimmed === '' ? undefined : trimmed;
  });

/** Only accept attachments uploaded to our Blob store through the brief upload route. */
export function isBriefBlobUrl(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.hostname.endsWith('.blob.vercel-storage.com') &&
      url.pathname.startsWith('/briefs/') &&
      url.pathname.toLowerCase().endsWith('.pdf')
    );
  } catch {
    return false;
  }
}

export function IsBriefBlobUrl(options?: ValidationOptions) {
  return (target: object, propertyName: string) =>
    registerDecorator({
      name: 'isBriefBlobUrl',
      target: target.constructor,
      propertyName,
      options: { message: 'attachment must be a PDF uploaded through this site', ...options },
      validator: { validate: isBriefBlobUrl },
    });
}
