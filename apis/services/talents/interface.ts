// Talent Detail API Interfaces

export interface AIEducation {
  institution: string;
  degree: string;
  year: string;
}

export interface AIWorkHistory {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface TalentProfile {
  user_id: string;
  updated_at: string;
  created_at: string;
  ai_analyzed_at: string | null;
  ai_education_history: AIEducation[];
  ai_email: string | null;
  ai_full_name: string | null;
  ai_languages: string[];
  ai_location: string | null;
  ai_overall_evaluation: string | null;
  ai_phone: string | null;
  ai_projects: unknown[];
  ai_skills: string[];
  ai_summary: string | null;
  ai_work_history: AIWorkHistory[];
  ai_social_links: unknown[];
  ats_score: number;
  cv_file_path: string | null;
  cv_public_id: string | null;
  resume: string | null;
  resume_public_id: string | null;
  analysis_completed_at: string | null;
  analysis_error: string | null;
  analysis_started_at: string | null;
  analysis_status: 'pending' | 'processing' | 'completed' | 'failed' | null;
  id: string;
}

export interface TalentUser {
  name: string;
  email: string;
  roles: string[];
  updated_at: string;
  created_at: string;
  id: string;
  profile: TalentProfile;
}

export interface TalentDetailResponse {
  user: TalentUser;
}
