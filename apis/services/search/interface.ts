// Search API Interfaces

export interface TalentSearchFilters {
  search?: string;
  skills?: string;
  min_experience?: number;
  max_experience?: number;
  min_ats_score?: number;
  max_ats_score?: number;
  location?: string;
  job_level?: 'entry' | 'junior' | 'mid' | 'senior' | 'lead' | 'executive' | '';
  actively_seeking?: boolean;
  per_page?: number;
  page?: number;
}

export interface Skill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Education {
  certificate_type: string;
  university: string;
  faculty: string;
  major: string;
  major_name: string;
  grade: string;
  from_date: string;
  awarded_date: string;
}

export interface WorkExperience {
  job_title: string;
  company_name: string;
  job_roles: string[];
  from_date: string;
  to_date: string | null;
  is_currently_working: boolean;
  description: string;
}

export interface SocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

export interface Talent {
  user_id: string;
  updated_at: string;
  created_at: string;
  address?: string;
  city?: string;
  current_job_status?: string;
  current_job_title?: string;
  date_of_birth?: string;
  education_history?: Education[];
  education_level?: string;
  expected_salary?: number;
  experience_summary?: string;
  first_name?: string;
  full_name?: string;
  gender?: string;
  image?: string;
  is_actively_seeking?: boolean;
  job_level?: string;
  job_roles?: string[];
  job_types?: string[];
  last_name?: string;
  location?: string;
  marital_status?: string;
  nationality?: string;
  phone?: string;
  salary_range_from?: number;
  salary_range_to?: number;
  skills?: Skill[];
  social_links?: SocialLinks;
  work_cities?: string[];
  work_experience?: WorkExperience[];
  years_of_experience?: number;
  id: string;
  name: string;
}

export interface TalentSearchResponse {
  data: Talent[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}
