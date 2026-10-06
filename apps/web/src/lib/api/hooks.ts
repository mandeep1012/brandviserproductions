'use client';

import { useInfiniteQuery, useMutation, type InfiniteData } from '@tanstack/react-query';
import type {
  CaseStudyQuery,
  CaseStudySummary,
  CreateEnquiryRequest,
  EnquiryCreated,
  Paginated,
  QuickEnquiryRequest,
} from '@brandviserproductions/contracts';
import { apiClient } from './client';
import type { ApiError } from './errors';

export const queryKeys = {
  /** `startPage` is part of the key: /gallery?page=3 starts its own list. */
  caseStudies: (filters: Omit<CaseStudyQuery, 'page'>, startPage: number) =>
    ['case-studies', filters, startPage] as const,
};

/**
 * Gallery "Load more". Page `startPage` is rendered by the server and passed in as
 * `initialPage`, so the first render needs no request; later pages are fetched here.
 */
export function useCaseStudies(
  filters: Omit<CaseStudyQuery, 'page'>,
  initialPage: Paginated<CaseStudySummary>,
) {
  return useInfiniteQuery<
    Paginated<CaseStudySummary>,
    ApiError,
    InfiniteData<Paginated<CaseStudySummary>, number>,
    ReturnType<typeof queryKeys.caseStudies>,
    number
  >({
    queryKey: queryKeys.caseStudies(filters, initialPage.page),
    queryFn: ({ pageParam, signal }) => apiClient.caseStudies({ ...filters, page: pageParam }, signal),
    initialPageParam: initialPage.page,
    initialData: { pages: [initialPage], pageParams: [initialPage.page] },
    getNextPageParam: (last) => (last.page < last.pageCount ? last.page + 1 : undefined),
    staleTime: 5 * 60_000,
  });
}

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
