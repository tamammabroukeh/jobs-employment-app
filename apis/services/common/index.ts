export * from './interface';
export * from './actions';

import { Methods } from '@/constants/methods';
import type { IRolesResponse, ICitiesResponse, ICategoriesResponse, IEducationLookupResponse } from './interface';
import apiFetcher from '@/apis/api.instance';

/**
 * Common API Repository
 * Handles API calls for roles, cities, categories, and other common data
 */
export const commonRepository = {
  /**
   * Get all available job roles
   * @returns Promise with roles list
   */
  getRoles: async (): Promise<IRolesResponse> => {
    return apiFetcher<IRolesResponse>('/roles', {
      method: Methods.GET,
      next: {
        tags: ['roles'],
        revalidate: 86400, // Cache for 24 hours
      },
    });
  },

  /**
   * Get all available cities
   * @returns Promise with cities list
   */
  getCities: async (): Promise<ICitiesResponse> => {
    return apiFetcher<ICitiesResponse>('/cities', {
      method: Methods.GET,
      next: {
        tags: ['cities'],
        revalidate: 86400, // Cache for 24 hours
      },
    });
  },

  /**
   * Get all available categories
   * @returns Promise with categories list
   */
  getCategories: async (): Promise<ICategoriesResponse> => {
    return apiFetcher<ICategoriesResponse>('/categories', {
      method: Methods.GET,
      next: {
        tags: ['categories'],
        revalidate: 86400, // Cache for 24 hours
      },
    });
  },

  /**
   * Get education lookup items (universities, faculties, majors)
   * No authentication required - intended for autocomplete and dropdown population
   * @param resource - The lookup table: 'universities', 'faculties', or 'majors'
   * @returns Promise with lookup items list
   */
  getEducationLookup: async (resource: 'universities' | 'faculties' | 'majors'): Promise<IEducationLookupResponse> => {
    return apiFetcher<IEducationLookupResponse>(`/${resource}`, {
      method: Methods.GET,
      next: {
        tags: [resource],
        revalidate: 86400, // Cache for 24 hours
      },
    });
  },
};
