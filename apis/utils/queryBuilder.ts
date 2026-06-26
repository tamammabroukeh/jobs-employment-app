/**
 * API Query Builder Utilities
 * Provides reusable functions for building query strings from parameters
 */

/**
 * Build query string from parameters object
 * Automatically filters out null, undefined, and empty string values
 * 
 * @param params - Object with query parameters
 * @returns Query string (without leading '?')
 * 
 * @example
 * buildQueryString({ page: 1, search: 'test', empty: null })
 * // Returns: "page=1&search=test"
 */
export function buildQueryString(params?: Record<string, any>): string {
  if (!params) return '';
  
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    // Skip null, undefined, and empty strings
    if (value !== null && value !== undefined && value !== '') {
      queryParams.append(key, String(value));
    }
  });
  
  return queryParams.toString();
}

/**
 * Build full endpoint URL with query string
 * 
 * @param baseEndpoint - Base endpoint path (e.g., '/companies')
 * @param params - Object with query parameters
 * @returns Full endpoint URL with query string
 * 
 * @example
 * buildEndpoint('/companies', { page: 1, search: 'test' })
 * // Returns: "/companies?page=1&search=test"
 * 
 * buildEndpoint('/companies', {})
 * // Returns: "/companies"
 */
export function buildEndpoint(baseEndpoint: string, params?: Record<string, any>): string {
  const queryString = buildQueryString(params);
  return queryString ? `${baseEndpoint}?${queryString}` : baseEndpoint;
}

/**
 * Convert typed params object to query string
 * Useful for strongly-typed API parameters
 * 
 * @param params - Typed parameters object
 * @returns Query string
 * 
 * @example
 * interface MyParams {
 *   page?: number;
 *   search?: string;
 * }
 * 
 * const params: MyParams = { page: 1, search: 'test' };
 * paramsToQueryString(params)
 * // Returns: "page=1&search=test"
 */
export function paramsToQueryString<T extends Record<string, any>>(params?: T): string {
  return buildQueryString(params);
}

/**
 * Merge multiple query parameter objects
 * Later objects override earlier ones
 * 
 * @param paramObjects - Array of parameter objects to merge
 * @returns Merged parameters object
 * 
 * @example
 * mergeParams(
 *   { page: 1, search: 'old' },
 *   { search: 'new', sort: 'asc' }
 * )
 * // Returns: { page: 1, search: 'new', sort: 'asc' }
 */
export function mergeParams<T extends Record<string, any>>(...paramObjects: (T | undefined)[]): T {
  return Object.assign({}, ...paramObjects.filter(Boolean)) as T;
}

/**
 * Build endpoint with merged parameters
 * Useful when you have default params and want to override some
 * 
 * @param baseEndpoint - Base endpoint path
 * @param paramObjects - Array of parameter objects to merge
 * @returns Full endpoint URL with merged query string
 * 
 * @example
 * buildEndpointWithMergedParams(
 *   '/companies',
 *   { per_page: 10, sort_by: 'rating' },
 *   { page: 2 }
 * )
 * // Returns: "/companies?per_page=10&sort_by=rating&page=2"
 */
export function buildEndpointWithMergedParams(
  baseEndpoint: string,
  ...paramObjects: (Record<string, any> | undefined)[]
): string {
  const mergedParams = mergeParams(...paramObjects);
  return buildEndpoint(baseEndpoint, mergedParams);
}
