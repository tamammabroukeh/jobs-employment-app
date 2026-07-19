export * from "./interface";

import { Methods } from '@/constants/methods';
import { buildQueryString } from '@/apis/utils/queryBuilder';
import type {
  TalentSearchFilters,
  TalentSearchResponse,
} from './interface';
import apiFetcher from "@/apis/api.instance";

/**
 * Search API Repository
 * Handles search-related API calls
 */
export const searchRepository = {
  /**
   * Search for talents/users with comprehensive filtering
   * @param filters - Search filters
   * @returns Promise with talent search response
   */
  searchTalents: (filters: TalentSearchFilters = {}): Promise<TalentSearchResponse> => {
    const queryString = buildQueryString(filters);
    const endpoint = queryString ? `/search/users?${queryString}` : '/search/users';
    return apiFetcher<TalentSearchResponse>(endpoint, {
      method: Methods.GET,
      cache: "no-store",
    });
  },
};
