/**
 * Shared search params utilities for both server and client side
 */

/**
 * Parse search params from Next.js server component searchParams prop
 * @param searchParams - The searchParams object from Next.js server component
 * @returns Parsed search params with defaults
 */
export function parseServerSearchParams(searchParams: {
  page?: string;
  per_page?: string;
  search?: string;
  [key: string]: string | string[] | undefined;
}) {
  const page = parseInt(searchParams.page || '1', 10);
  const per_page = parseInt(searchParams.per_page || '15', 10);
  const search = searchParams.search || '';

  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    per_page: isNaN(per_page) || per_page < 1 ? 15 : per_page,
    search,
  };
}

/**
 * Build URL search params string from object
 * @param params - Object with search params
 * @returns URL search params string
 */
export function buildSearchParamsString(params: Record<string, string | number | boolean | null | undefined>): string {
  const urlParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      urlParams.set(key, String(value));
    }
  });
  
  return urlParams.toString();
}

/**
 * Update search params while preserving existing ones
 * @param currentParams - Current URLSearchParams
 * @param updates - Object with params to update
 * @returns New URLSearchParams string
 */
export function updateSearchParams(
  currentParams: URLSearchParams | string,
  updates: Record<string, string | number | null | undefined>
): string {
  const params = typeof currentParams === 'string' 
    ? new URLSearchParams(currentParams)
    : new URLSearchParams(currentParams.toString());
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '') {
      params.delete(key);
    } else {
      params.set(key, String(value));
    }
  });
  
  return params.toString();
}