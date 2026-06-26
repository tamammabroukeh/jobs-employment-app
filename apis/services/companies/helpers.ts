import { ICompaniesQueryParams } from "./interface";

/**
 * Parse companies search params with defaults
 */
export function parseCompaniesSearchParams(searchParams: {
  page?: string;
  per_page?: string;
  search?: string;
  industry?: string;
  location?: string;
  company_size?: string;
  sort_by?: string;
  sort_order?: string;
}): ICompaniesQueryParams {
  const page = parseInt(searchParams.page || '1', 10);
  const per_page = parseInt(searchParams.per_page || '15', 10);
  const sort_by = searchParams.sort_by as 'rating' | 'name' | 'open_positions' | 'created_at' | undefined;

  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    per_page: isNaN(per_page) || per_page < 1 ? 15 : per_page,
    search: searchParams.search || '',
    industry: searchParams.industry,
    location: searchParams.location,
    company_size: searchParams.company_size,
    sort_by: sort_by && ['rating', 'name', 'open_positions', 'created_at'].includes(sort_by) ? sort_by : undefined,
    sort_order: searchParams.sort_order === 'asc' ? 'asc' : 'desc',
  };
}