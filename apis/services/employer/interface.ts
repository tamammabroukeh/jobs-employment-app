// Employer API Interfaces

export interface CreateJobRequest {
  communication_method: string; // 'by_forsa' | 'by_phone' | 'by_website'
  communication_value: string | null;
  title: string;
  roles: string[];
  portfolio_required: boolean;
  cover_letter_required: boolean;
  gender: string; // 'no_preference' | 'male' | 'female'
  age_from: number | null;
  age_to: number | null;
  education_level: string; // 'high_school' | 'diploma' | 'bachelor' | 'master' | 'phd' | 'any'
  job_level: string; // 'entry' | 'junior' | 'mid' | 'senior' | 'manager' | 'director'
  experience_years: number;
  languages: string[];
  vacancies: number;
  job_type: string; // 'full_time' | 'part_time' | 'contract' | 'freelance'
  work_mode: string; // 'on_site' | 'remote' | 'hybrid'
  city: string;
  address: string;
  salary_from: number;
  salary_to: number;
  currency: string;
  display_salary: boolean;
  incentives: string;
  description: string;
  requirements: string;
  questions: Array<{
    question: string;
    required: boolean;
  }>;
  tags: string[];
  category: string;
  expires_at: string; // Date string (ISO format)
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

// Candidate/Seeker Interfaces
export interface CandidateSkill {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface CandidateEducation {
  certificate_type: string;
  university: string;
  faculty: string;
  major: string;
  major_name: string;
  grade: string;
  from_date: string;
  awarded_date: string;
}

export interface CandidateWorkExperience {
  job_title: string;
  company_name: string;
  job_roles: string[];
  from_date: string;
  to_date: string;
  is_currently_working: boolean;
  description: string;
}

export interface CandidateSocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

export interface Candidate {
  id: string;
  user_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email?: string;
  phone: string;
  date_of_birth: string;
  gender: string;
  marital_status: string;
  nationality: string;
  city: string;
  address: string;
  location: string;
  image: string | null;
  current_job_title: string;
  current_job_status: string;
  is_actively_seeking: boolean;
  job_level: string;
  years_of_experience: number;
  education_level: string;
  job_roles: string[];
  job_types: string[];
  work_cities: string[];
  salary_range_from: number;
  salary_range_to: number;
  expected_salary: number;
  experience_summary: string;
  skills: CandidateSkill[];
  education_history: CandidateEducation[];
  work_experience: CandidateWorkExperience[];
  social_links: CandidateSocialLinks;
  created_at: string;
  updated_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface CandidatesPaginationData {
  current_page: number;
  data: Candidate[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface CandidatesResponse {
  seekers: CandidatesPaginationData;
}

export interface CandidatesQueryParams {
  page?: number;
  per_page?: number;
  skills?: string; // Comma-separated list of required skills
  min_ats_score?: number; // Minimum ATS score (e.g., 70)
  max_ats_score?: number; // Maximum ATS score (e.g., 95)
  location?: string; // Partial match on AI-detected location
  keyword?: string; // Partial match on AI summary or current job title
}

// Candidate Detail Response
export interface CandidateDetailResponse {
  seeker: {
    user_id: string;
    name: string;
    profile: Candidate;
  };
}
