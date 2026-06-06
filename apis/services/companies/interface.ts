// Company/Employer Interfaces

export interface ICompanySocialMedia {
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
}

export interface ICompanySizeRange {
  min: number;
  max?: number;
  isPlus: boolean;
}

export interface ICategoryRatings {
  compensation: number;
  culture: number;
  work_life: number;
  diversity: number;
  management: number;
}

export interface ICompany {
  id: string;
  employer_id: string;
  name: string;
  logo: string;
  cover_image: string;
  description: string;
  location: string;
  company_size: string;
  employee_count: string;
  industry: string;
  website: string;
  founded: string;
  social_media: ICompanySocialMedia;
  rating: number;
  review_count: number;
  would_recommend: number;
  ceo_performance: number;
  category_ratings: ICategoryRatings;
  reviews: any[]; // You can define a proper review interface if needed
  open_positions: number;
  company_size_range: ICompanySizeRange;
  created_at: string;
  updated_at: string;
}

export interface ICompaniesResponse {
  data: ICompany[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
  next_page_url: string | null;
  prev_page_url: string | null;
}

export interface ICompanyDetailResponse {
  data: ICompany;
}
export type TSortByOption = "rating" | "name" | "open_positions" | "created_at"

export interface ICompaniesQueryParams {
  page: number;
  per_page: number;
  search: string;
  industry?: string;
  location?: string;
  company_size?: string;
  sort_by?: TSortByOption;
  sort_order?: "asc" | "desc";
}