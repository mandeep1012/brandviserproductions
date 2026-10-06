import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { describe, expect, it } from 'vitest';
import { fieldErrors } from '../../common/validation.js';
import { CreateEnquiryDto } from './dto/create-enquiry.dto.js';
import { isBriefBlobUrl } from './dto/enquiry-rules.js';
import { QuickEnquiryDto } from './dto/quick-enquiry.dto.js';
import { decoyReference, formatReference } from './enquiry-reference.js';

const validate = <T extends object>(cls: new () => T, body: object) =>
  fieldErrors(validateSync(plainToInstance(cls, body), { whitelist: true, forbidNonWhitelisted: true }));

const valid = {
  services: ['concept-execution', 'btl'],
  eventType: 'PRODUCT_LAUNCH',
  name: 'Asha Rao',
  company: 'Acme',
  email: 'asha@acme.example',
  phone: '+91 98765 43210',
  consent: true,
};

describe('formatReference', () => {
  it('pads the sequence and uses the UTC year', () => {
    expect(formatReference(42, new Date('2026-10-06T10:00:00Z'))).toBe('BV-2026-0042');
    expect(formatReference(12345, new Date('2027-01-01T00:00:00Z'))).toBe('BV-2027-12345');
  });

  it('makes decoys that look like real references', () => {
    expect(decoyReference(new Date('2026-05-01T00:00:00Z'))).toMatch(/^BV-2026-\d{4}$/);
  });
});

describe('CreateEnquiryDto', () => {
  it('accepts a complete enquiry', () => {
    expect(validate(CreateEnquiryDto, valid)).toEqual({});
  });

  it('reports each missing required field by name', () => {
    const errors = validate(CreateEnquiryDto, { services: [] });
    expect(Object.keys(errors).sort()).toEqual(['company', 'consent', 'email', 'name', 'phone']);
  });

  it('requires consent to be exactly true', () => {
    expect(validate(CreateEnquiryDto, { ...valid, consent: 'yes' })).toHaveProperty('consent');
  });

  it('rejects unknown enum values, bad emails and bad phones', () => {
    const errors = validate(CreateEnquiryDto, { ...valid, budgetRange: 'HUGE', email: 'nope', phone: 'call me' });
    expect(Object.keys(errors).sort()).toEqual(['budgetRange', 'email', 'phone']);
  });

  it('rejects attachments that were not uploaded as briefs', () => {
    expect(validate(CreateEnquiryDto, { ...valid, attachmentUrl: 'https://evil.example/x.pdf' })).toHaveProperty(
      'attachmentUrl',
    );
  });

  it('rejects unexpected properties', () => {
    expect(validate(CreateEnquiryDto, { ...valid, isAdmin: true })).toHaveProperty('isAdmin');
  });
});

describe('QuickEnquiryDto', () => {
  it('needs a name, phone and event type', () => {
    expect(validate(QuickEnquiryDto, { name: 'Asha', phone: '9876543210', eventType: 'CONFERENCE' })).toEqual({});
    expect(Object.keys(validate(QuickEnquiryDto, {})).sort()).toEqual(['eventType', 'name', 'phone']);
  });
});

describe('isBriefBlobUrl', () => {
  it('only allows PDFs under /briefs/ on Vercel Blob over https', () => {
    expect(isBriefBlobUrl('https://abc.private.blob.vercel-storage.com/briefs/brief-x1y2.pdf')).toBe(true);
    expect(isBriefBlobUrl('http://abc.private.blob.vercel-storage.com/briefs/a.pdf')).toBe(false);
    expect(isBriefBlobUrl('https://abc.private.blob.vercel-storage.com/other/a.pdf')).toBe(false);
    expect(isBriefBlobUrl('https://blob.vercel-storage.com.evil.example/briefs/a.pdf')).toBe(false);
    expect(isBriefBlobUrl('https://abc.blob.vercel-storage.com/briefs/a.exe')).toBe(false);
  });
});
