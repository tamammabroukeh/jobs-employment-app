export * from './interfaces';

import { Methods } from '@/constants/methods';
import type { JobsListResponse, JobsQueryParams, Job } from './interfaces';
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
};
