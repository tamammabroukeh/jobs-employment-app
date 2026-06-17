// Job Seeker Profile Interfaces

export interface IJobSeekerProfile {
  id: string;
  user_id: string;
  updated_at: string;
  created_at: string;
  address: string;
  email: string;
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

export interface IJobSeekerProfileResponse {
  profile: IJobSeekerProfile;
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
  image?: string;
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