'use client';

import { useMutation } from '@tanstack/react-query';
import type { CreateEnquiryRequest, EnquiryCreated, QuickEnquiryRequest } from '@brandviserproductions/contracts';
import { apiClient } from './client';
import type { ApiError } from './errors';

export function useSubmitEnquiry() {
  return useMutation<EnquiryCreated, ApiError, CreateEnquiryRequest>({
    mutationFn: apiClient.createEnquiry,
  });
}

export function useSubmitQuickEnquiry() {
  return useMutation<EnquiryCreated, ApiError, QuickEnquiryRequest>({
    mutationFn: apiClient.createQuickEnquiry,
  });
}
