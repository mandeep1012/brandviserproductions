import type { CreateEnquiryRequest, EnquiryCreated, QuickEnquiryRequest } from '@brandviserproductions/contracts';
import { API_BASE } from '../config';
import { endpoints } from './endpoints';
import { ApiError, toApiError } from './errors';

/** Browser fetch against NEXT_PUBLIC_API_URL (CORS-enabled on the API). */
async function clientFetch<T>(path: string, init?: RequestInit): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: { accept: 'application/json', ...(init?.body ? { 'content-type': 'application/json' } : {}) },
    });
  } catch {
    // Offline, DNS, CORS or the API being down all surface as a network error.
    throw new ApiError(0, { message: 'Could not reach the server. Check your connection and try again.' });
  }
  if (!res.ok) throw await toApiError(res);
  return (await res.json()) as T;
}

export const apiClient = {
  createEnquiry: (body: CreateEnquiryRequest) =>
    clientFetch<EnquiryCreated>(endpoints.enquiries(), { method: 'POST', body: JSON.stringify(body) }),
  createQuickEnquiry: (body: QuickEnquiryRequest) =>
    clientFetch<EnquiryCreated>(endpoints.quickEnquiries(), { method: 'POST', body: JSON.stringify(body) }),
};

export const briefUploadUrl = `${API_BASE}${endpoints.briefUpload()}`;
