export * from './interfaces';
export * from './actions';

import { Methods } from '@/constants/methods';
import type { JobsListResponse, JobsQueryParams, Job, CategoryStatsResponse, LocationStatsResponse } from './interfaces';
import { buildQueryString } from '@/apis/utils/queryBuilder';
import apiFetcher from '@/apis/api.instance';

/**
 * Jobs API Repository
 * Handles all public job-related API calls
 */
export const jobsRepository = {
  /**
   * Get public jobs list with pagination and filters
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated jobs response
   */
  getJobs: (params?: JobsQueryParams): Promise<JobsListResponse> => {
    const queryString = params ? buildQueryString(params) : '';
    const url = queryString ? `/jobs?${queryString}` : '/jobs';
    return apiFetcher<JobsListResponse>(url, {
      method: Methods.GET,
      cache: 'no-store',
    });
  },

  /**
   * Get single job by ID
   * @param id - Job ID
   * @returns Promise with job data
   */
  getJobById: (id: string): Promise<Job> =>
    apiFetcher<Job>(`/jobs/${id}`, {
      method: Methods.GET,
      cache: 'no-store',
      next: {
        tags: ['job-details'],
        revalidate: 3600,
      },
    }),

  /**
   * Get active job counts grouped by category
   * @returns Promise with category statistics
   */
  getCategoryStats: (): Promise<CategoryStatsResponse> =>
    apiFetcher<CategoryStatsResponse>('/jobs/stats/by-category', {
      method: Methods.GET,
      next: {
        tags: ['category-stats'],
        revalidate: 3600, // Cache for 1 hour
      },
    }),

  /**
   * Get active job counts grouped by city
   * @returns Promise with location statistics
   */
  getLocationStats: (): Promise<LocationStatsResponse> =>
    apiFetcher<LocationStatsResponse>('/jobs/stats/by-location', {
      method: Methods.GET,
      next: {
        tags: ['location-stats'],
        revalidate: 3600, // Cache for 1 hour
      },
    }),
};
