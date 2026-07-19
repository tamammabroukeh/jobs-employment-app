/**
 * Job Question Interface
 */
export interface JobQuestion {
  question: string;
  required: boolean;
}
export type TCommunicationMethods = 'by_forsa' | 'by_email' | 'by_website'
export type TGender = 'male' | 'female' | 'no_preference'
export type TEducationlevel = 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd'
export type TJobLevel = 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
export type TJobType = 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
export type TWorkMode = 'junior' | 'mid' | 'senior' | 'lead' | 'manager'
/**
 * Company Profile Interface
 */
export interface CompanyProfile {
  _id: string;
  slug: string;
  name: string;
  logo: string | null;
  description: string;
  city: string;
  country: string;
  social_media: {
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    website?: string;
  } | null;
}

/**
 * Job Interface (API Response)
 */
export interface Job {
  id: string;
  job_id: string;
  communication_method: TCommunicationMethods;
  communication_value: string | null;
  title: string;
  portfolio_required: boolean;
  cover_letter_required: boolean;
  gender: TGender;
  age_from: number | null;
  age_to: number | null;
  education_level: TEducationlevel;
  job_level: TJobLevel;
  experience_years: number;
  vacancies: number;
  job_type: TJobType;
  work_mode: TWorkMode;
  city: string;
  address: string;
  salary_from: number | string;
  salary_to: number | string;
  currency: string;
  display_salary: boolean;
  incentives: string | null;
  description: string;
  requirements: string;
  questions: JobQuestion[];
  category: string;
  expires_at: string;
  roles: string[];
  languages: string[];
  tags: string[];
  employer_id: string;
  company_profile_id: string;
  company_name: string;
  company_logo: string | null;
  company?: CompanyProfile; // Company details (populated in single job response)
  is_active: boolean;
  updated_at: string;
  created_at: string;
  
  // Legacy fields (for backward compatibility)
  experience_level?: string;
  experience_required?: string;
  location?: string;
  salary_range?: string;
}

/**
 * Jobs List Response Interface (Paginated)
 */
export interface JobsListResponse {
  data: Job[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

/**
 * Jobs Query Parameters
 */
export interface JobsQueryParams {
  page?: number;
  per_page?: number;
  category?: string;
  job_type?: string;
  work_mode?: string;
  job_level?: string;
  city?: string;
  search?: string;
}