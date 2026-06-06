'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from 'next/navigation';
import { updateSearchParams } from '@/lib/searchParams';
import { ICompaniesQueryParams, TSortByOption } from '@/apis/services/companies/interface';

/**
 * Custom hook for managing companies search parameters
 * This hook provides a convenient way to read and update search params
 * for the companies page in client components
 */
export function useCompaniesSearchParams() {
  const router = useRouter();
  const searchParams = useNextSearchParams();
  const pathname = usePathname();

  /**
   * Get current search params as a typed object
   */
  const getCurrentParams = useCallback((): Partial<ICompaniesQueryParams> => {
    return {
      page: parseInt(searchParams.get('page') || '1', 10),
      per_page: parseInt(searchParams.get('per_page') || '15', 10),
      search: searchParams.get('search') || '',
      industry: searchParams.get('industry') || undefined,
      location: searchParams.get('location') || undefined,
      company_size: searchParams.get('company_size') || undefined,
      sort_by: searchParams.get('sort_by') as TSortByOption || undefined,
      sort_order: (searchParams.get('sort_order') as 'asc' | 'desc') || undefined,
    };
  }, [searchParams]);

  /**
   * Update one or more search parameters
   * @param updates - Object with params to update (null/undefined values will remove the param)
   */
  const updateParams = useCallback(
    (updates: Partial<Record<keyof ICompaniesQueryParams, string | number | null | undefined>>) => {
      const paramsString = updateSearchParams(searchParams, updates);
      router.push(`${pathname}?${paramsString}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Set search query and reset to page 1
   */
  const setSearch = useCallback(
    (search: string) => {
      updateParams({ search: search || null, page: search ? 1 : undefined });
    },
    [updateParams]
  );

  /**
   * Set page number
   */
  const setPage = useCallback(
    (page: number) => {
      updateParams({ page });
    },
    [updateParams]
  );

  /**
   * Set page size and reset to page 1
   */
  const setPageSize = useCallback(
    (per_page: number) => {
      updateParams({ per_page, page: 1 });
    },
    [updateParams]
  );

  /**
   * Set filter and reset to page 1
   */
  const setFilter = useCallback(
    (key: 'industry' | 'location' | 'company_size', value: string | null) => {
      updateParams({ [key]: value, page: 1 });
    },
    [updateParams]
  );

  /**
   * Set sorting
   */
  const setSort = useCallback(
    (sort_by: string, sort_order: 'asc' | 'desc' = 'desc') => {
      updateParams({ sort_by, sort_order });
    },
    [updateParams]
  );

  /**
   * Clear all filters and search, keep pagination
   */
  const clearFilters = useCallback(() => {
    updateParams({
      search: null,
      industry: null,
      location: null,
      company_size: null,
      page: 1,
    });
  }, [updateParams]);

  /**
   * Reset all params to defaults
   */
  const resetAll = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    // Current params
    params: getCurrentParams(),
    searchParams,
    
    // Update methods
    updateParams,
    setSearch,
    setPage,
    setPageSize,
    setFilter,
    setSort,
    clearFilters,
    resetAll,
  };
}
