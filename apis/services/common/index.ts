export * from './interface';
export * from './actions';

import { Methods } from '@/constants/methods';
import type { IRolesResponse, ICitiesResponse, ICategoriesResponse } from './interface';
import { authFetcher } from '@/apis/authInstace';

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
    return authFetcher<IRolesResponse>('/roles', {
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
    return authFetcher<ICitiesResponse>('/cities', {
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
    return authFetcher<ICategoriesResponse>('/categories', {
      method: Methods.GET,
      next: {
        tags: ['categories'],
        revalidate: 86400, // Cache for 24 hours
      },
    });
  },
};
