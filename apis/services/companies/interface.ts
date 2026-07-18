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

export interface ICompanyJob {
  id: string;
  job_id: string;
  title: string;
  city: string;
  job_type: string;
  work_mode: string;
  job_level: string;
  experience_years: number;
  roles: string[];
  tags: string[];
  created_at: string;
}

export interface ICompany {
  _id: string; // MongoDB ID
  name: string;
  slug: string;
  logo: string | null;
  cover_image: string | null;
  description: string;
  industry: string;
  company_size: string;
  city: string;
  country: string;
  email: string;
  rating: number;
  review_count: number;
  would_recommend: number;
  ceo_performance: number;
  created_at: string;
  updated_at: string;
  open_positions: number;
  jobs: ICompanyJob[];
  reviews: any[];
  category_ratings: ICategoryRatings;
  
  // Optional fields (may not be in all responses)
  id?: string;
  employer_id?: string;
  location?: string;
  employee_count?: string;
  website?: string;
  founded?: string;
  social_media?: ICompanySocialMedia;
  company_size_range?: ICompanySizeRange;
}

export interface ICompaniesResponse {
  data: ICompany[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

export interface ICompanyDetailResponse extends ICompany{}

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