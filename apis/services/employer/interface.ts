// Employer API Interfaces

export interface CreateJobRequest {
  communication_method: string; // 'by_forsa' | 'by_email' | 'by_website'
  communication_value: string | null;
  title: string;
  roles: string[];
  portfolio_required: boolean;
  cover_letter_required: boolean;
  gender: string; // 'no_preference' | 'male' | 'female'
  age_from: number | null;
  age_to: number | null;
  education_level: string; // 'bachelor' | 'master' | 'phd' etc
  job_level: string; // 'junior' | 'mid' | 'senior'
  experience_years: number;
  languages: string[];
  vacancies: number;
  job_type: string; // 'full_time' | 'part_time' | 'contract'
  work_mode: string; // 'on_site' | 'remote' | 'hybrid'
  city: string;
  address: string;
  salary_from: string;
  salary_to: string;
  currency: string;
  display_salary: boolean;
  incentives: string;
  description: string;
  requirements: string;
  questions: Array<{
    question: string;
    required: string; // 'true' | 'false'
  }>;
  tags: string[];
  category: string;
  expires_at: string; // Date string
}

export interface UpdateJobRequest extends Partial<CreateJobRequest> {
  id: string;
}

export interface Job extends CreateJobRequest {
  id: string;
  job_id: string; // Unique job identifier like "JOB-0027"
  employer_id: string;
  company_profile_id: string;
  company_name: string;
  company_logo: string | null;
  is_active: boolean;
  application_count: number;
  created_at: string;
  updated_at: string;
}

export interface EmployerJobsResponse {
  success: boolean;
  message?: string;
  data: {
    jobs: Job[];
    pagination?: {
      current_page: number;
      total_pages: number;
      total_items: number;
      per_page: number;
    };
  };
}

export interface CreateJobResponse {
  success: boolean;
  message: string;
  data: {
    job: Job;
  };
}

export interface UpdateJobResponse {
  success: boolean;
  message: string;
  data: {
    job: Job;
  };
}

export interface DeleteJobResponse {
  success: boolean;
  message: string;
}

// Company Profile Interfaces
export interface CompanyProfile {
  id: string;
  name: string;
  description: string;
  industry: string;
  company_size: 'less_than_10' | '10_to_50' | '51_to_200' | '201_to_500' | '501_to_1000' | '1001_to_5000' | 'more_than_5000';
  city: string;
  country: string;
  phone: string;
  phone_visible: boolean;
  email: string;
  employer_id: string;
  slug: string;
  rating: number;
  review_count: number;
  would_recommend: number;
  ceo_performance: number;
  category_ratings: {
    compensation: number;
    culture: number;
    work_life: number;
    diversity: number;
    management: number;
  };
  reviews: unknown[];
  updated_at: string;
  created_at: string;
  open_positions: number;
}

export interface UpdateCompanyRequest {
  name?: string;
  description?: string;
  industry?: string;
  company_size?: string;
  city?: string;
  country?: string;
  phone?: string;
  phone_visible?: boolean;
  email?: string;
}

export interface CompanyProfileResponse {
  success: boolean;
  message?: string;
  data?: CompanyProfile;
}
