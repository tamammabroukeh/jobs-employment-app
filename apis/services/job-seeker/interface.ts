// Job Seeker Profile Interfaces

import { TCommunicationMethods, TEducationlevel, TGender, TJobLevel, TJobType, TWorkMode } from "../jobs";

export interface IJobSeekerProfile {
  id: string;
  user_id: string;
  updated_at: string;
  created_at: string;
  address: string;
  city: string;
  current_job_status: string;
  current_job_title: string;
  date_of_birth: string;
  education_history: IEducation[];
  education_level: string;
  expected_salary: number;
  experience_summary: string;
  first_name: string;
  full_name: string;
  gender: string;
  email: string;
  image: string;
  is_actively_seeking: boolean;
  job_level: string;
  job_roles: string[];
  job_types: string[];
  last_name: string;
  location: string;
  marital_status: string;
  nationality: string;
  phone: string;
  salary_range_from: number;
  salary_range_to: number;
  skills: ISkill[];
  social_links: ISocialLinks;
  work_cities: string[];
  work_experience: IWorkExperience[];
  years_of_experience: number;
}

export interface IEducation {
  certificate_type: string;
  university: string;
  faculty: string;
  major: string;
  major_name: string;
  grade: string;
  from_date: string;
  awarded_date: string;
}

export interface ISkill {
  name: string;
  level: string;
}

export interface ISocialLinks {
  linkedin?: string;
  github?: string;
  portfolio?: string;
  twitter?: string;
}

export interface IWorkExperience {
  job_title: string;
  company_name: string;
  job_roles: string[];
  from_date: string;
  to_date: string;
  is_currently_working: boolean;
  description: string;
}

export interface IJobSeekerDocuments {
  cv_url: string | null;
  cv_analyzed_at: string | null;
  resume_url: string | null;
  default_cover_letter: string | null;
}

export interface IJobSeekerProfileResponse {
  profile: IJobSeekerProfile;
  documents: IJobSeekerDocuments;
}

// Update Profile Request Interface
export interface IUpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  image?: string;
  gender?: string;
  nationality?: string;
  city?: string;
  location?: string;
  address?: string;
  phone?: string;
  date_of_birth?: string;
  marital_status?: string;
  salary_range_from?: number;
  salary_range_to?: number;
  current_job_status?: string;
  years_of_experience?: number;
  education_level?: string;
  job_level?: string;
  job_types?: string[];
  job_roles?: string[];
  work_cities?: string[];
  current_job_title?: string;
  experience_summary?: string;
  expected_salary?: number;
  is_actively_seeking?: boolean;
  social_links?: ISocialLinks;
  skills?: ISkill[];
  education_history?: IEducation[];
  work_experience?: IWorkExperience[];
  resume?: File;
}

export interface IUpdateProfileResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Update Personal Info Request Interface
export interface IUpdatePersonalInfoRequest {
  first_name?: string;
  last_name?: string;
  full_name?: string;
  image?: File; // JPEG/PNG/WEBP profile photo, max 2MB
  gender?: string;
  nationality?: string;
  city?: string;
  location?: string;
  address?: string;
  phone?: string;
  date_of_birth?: string;
  marital_status?: string;
}

export interface IUpdatePersonalInfoResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Update Career Info Request Interface
export interface IUpdateCareerInfoRequest {
  salary_range_from?: number;
  salary_range_to?: number;
  current_job_status?: string;
  years_of_experience?: number;
  education_level?: string;
  job_level?: string;
  job_types?: string[];
  job_roles?: string[];
  work_cities?: string[];
  current_job_title?: string;
  experience_summary?: string;
  expected_salary?: number;
  is_actively_seeking?: boolean;
}

export interface IUpdateCareerInfoResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Update Social Links Request Interface
export interface IUpdateSocialLinksRequest {
  social_links: ISocialLinks;
}

export interface IUpdateSocialLinksResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Update Skills Request Interface
export interface IUpdateSkillsRequest {
  skills: ISkill[];
}

export interface IUpdateSkillsResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Update Education Request Interface
export interface IUpdateEducationRequest {
  education_history: IEducation[];
}

export interface IUpdateEducationResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}

// Update Work Experience Request Interface
export interface IUpdateWorkExperienceRequest {
  work_experience: IWorkExperience[];
}

export interface IUpdateWorkExperienceResponse {
  status: boolean;
  message: string;
  profile: IJobSeekerProfile;
}
export type TJobTypes = 'full_time' | 'part_time' | 'contract' | 'freelance' | ''
// Job Search Interfaces
export interface JobSearchFilters {
  keyword?: string;
  location?: string;
  job_type?: TJobTypes;
  category?: string;
  min_salary?: number;
  page?: number;
}

export interface JobSearchResponse {
  jobs: {
    current_page: number;
    data: Array<{
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
      questions: Array<{ question: string; required: boolean }>;
      category: string;
      expires_at: string;
      roles: string[];
      languages: string[];
      tags: string[];
      job_id: string;
      employer_id: string;
      company_profile_id: string;
      company_name: string;
      company_logo: string | null;
      is_active: boolean;
      updated_at: string;
      created_at: string;
      id: string;
      // Legacy fields
      experience_level?: string;
      experience_required?: string;
      location?: string;
      salary_range?: string;
    }>;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}

// Matched Jobs Interfaces
export interface MatchedJobsFilters {
  min_score?: number;
  page?: number;
}

export interface MatchedJob {
  title: string;
  description: string;
  requirements: string;
  company_name: string;
  company_logo?: string | null;
  job_type: string;
  work_mode: string;
  experience_level: string;
  experience_required: string;
  location: string;
  category?: string;
  salary_range: string;
  tags: string[];
  roles: string[];
  job_id: string;
  employer_id: string;
  is_active: boolean;
  updated_at: string;
  created_at: string;
  id: string;
  match_score: number;
}

export interface MatchedJobsResponse {
  data: MatchedJob[];
  current_page: number;
  per_page: number;
  total: number;
  total_pages: number;
  next_page: number | null;
  prev_page: number | null;
}

// Resume Upload Interfaces
export interface IAIAnalysisProfile {
  user_id: string;
  updated_at: string;
  created_at: string;
  ai_analyzed_at: string;
  ai_education_history: Array<{
    institution: string;
    degree: string;
    year: string;
  }>;
  ai_email: string;
  ai_full_name: string;
  ai_languages: string[];
  ai_location: string;
  ai_overall_evaluation: string;
  ai_phone: string;
  ai_projects: any[];
  ai_skills: string[];
  ai_social_links: any[];
  ai_summary: string;
  ai_work_history: Array<{
    company: string | null;
    role: string;
    duration: string | null;
    description: string;
  }>;
  analysis_completed_at: string;
  analysis_error: string | null;
  analysis_started_at: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  ats_score: number;
  cv_file_path: string;
  cv_public_id: string;
  resume: string;
  resume_public_id: string;
  id: string;
}

export interface IUploadResumeResponse {
  message: string;
  resume_url: string;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed';
  profile?: IAIAnalysisProfile;
}

// Delete Resume Response
export interface IDeleteResumeResponse {
  message: string;
}

// Update Cover Letter Interfaces
export interface IUpdateCoverLetterRequest {
  cover_letter: string;
}

export interface IUpdateCoverLetterResponse {
  message: string;
  cover_letter: string;
}

// Delete Cover Letter Response
export interface IDeleteCoverLetterResponse {
  message: string;
}

/**
 * Apply Job Request Interface
 */
export interface IApplyJobRequest {
  job_post_id: string;
  cover_letter?: string;
  resume?: File;
  education?: string;
  last_work?: string;
  years_of_experience?: number;
  why_join?: string;
  what_to_add?: string;
  positions_suited_for?: string[];
  notice_period?: string;
  expected_salary?: string;
}

/**
 * Apply Job Response Interface
 */
export interface IApplyJobResponse {
  status: boolean;
  message: string;
  application_id?: string;
}

/**
 * Job Application Interface
 */
export interface IJobApplication {
  id: string;
  user_id: string;
  job_post_id: string;
  cover_letter: string | null;
  resume: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  applied_at: string;
  education: string;
  last_work: string;
  years_of_experience: number;
  why_join: string | null;
  what_to_add: string | null;
  positions_suited_for: string | null;
  notice_period: string;
  expected_salary: string;
  updated_at: string;
  created_at: string;
  job_post: {
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
    salary_from: number;
    salary_to: number;
    currency: string;
    display_salary: boolean;
    incentives: string | null;
    description: string;
    requirements: string;
    questions: Array<{ question: string; required: boolean }>;
    category: string;
    expires_at: string;
    roles: string[];
    languages: string[];
    tags: string[];
    job_id: string;
    employer_id: string;
    company_profile_id: string;
    company_name: string;
    company_logo: string | null;
    is_active: boolean;
    updated_at: string;
    created_at: string;
    id: string;
  };
}

/**
 * Job Applications Query Params
 */
export interface IApplicationsQueryParams {
  per_page?: number; // max 100, default 15
  page?: number;
}

/**
 * Job Applications Response Interface
 */
export interface IJobApplicationsResponse {
  applications: {
    current_page: number;
    data: IJobApplication[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  };
}
