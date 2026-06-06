import apiFetcher from '@/apis/api.instance';
import { Methods } from '@/constants/methods';
import { buildEndpoint } from '@/apis/utils';
import { 
  ICompaniesResponse, 
  ICompanyDetailResponse, 
  ICompaniesQueryParams 
} from './interface';

/**
 * Companies/Employers API Repository
 * Handles all company-related API calls
 */
export const companiesRepository = {
  /**
   * Get list of companies with optional filters and pagination
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with paginated companies data
   */
  getCompanies: (params?: ICompaniesQueryParams): Promise<ICompaniesResponse> => {
    const endpoint = buildEndpoint('/companies', params);
    
    return apiFetcher<ICompaniesResponse>(endpoint, {
      method: Methods.GET,
    });
  },

  /**
   * Get a single company by ID
   * @param id - Company ID
   * @returns Promise with company details
   */
  getCompanyById: (id: string): Promise<ICompanyDetailResponse> =>
    apiFetcher<ICompanyDetailResponse>(`/companies/${id}`, {
      method: Methods.GET,
    }),

  /**
   * Get top/featured companies
   * @param limit - Number of companies to fetch
   * @returns Promise with top companies data
   */
  getTopCompanies: (limit: number = 8): Promise<ICompaniesResponse> => {
    const endpoint = buildEndpoint('/companies', {
      per_page: limit,
      sort_by: 'rating',
      sort_order: 'desc',
    });
    
    return apiFetcher<ICompaniesResponse>(endpoint, {
      method: Methods.GET,
    });
  },
};
