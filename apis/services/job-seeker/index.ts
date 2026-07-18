import { authFetcher } from '@/apis/authInstace';
import { Methods } from '@/constants/methods';
import { 
  IJobSeekerProfileResponse, 
  IUpdatePersonalInfoRequest, 
  IUpdatePersonalInfoResponse, 
  IUpdateCareerInfoRequest, 
  IUpdateCareerInfoResponse, 
  IUpdateSocialLinksRequest, 
  IUpdateSocialLinksResponse, 
  IUpdateSkillsRequest, 
  IUpdateSkillsResponse, 
  IUpdateEducationRequest, 
  IUpdateEducationResponse, 
  IUpdateWorkExperienceRequest, 
  IUpdateWorkExperienceResponse,
  JobSearchFilters,
  JobSearchResponse,
  MatchedJobsFilters,
  MatchedJobsResponse,
  IUploadResumeResponse,
  IDeleteResumeResponse,
  IUpdateCoverLetterResponse,
  IDeleteCoverLetterResponse
} from './interface';

/**
 * Job Seeker API Repository
 * Handles all job seeker-related API calls
 */
export const jobSeekerRepository = {
  /**
   * Get job seeker profile
   * @returns Promise with job seeker profile response
   */
  getProfile: (): Promise<IJobSeekerProfileResponse> =>
    authFetcher<IJobSeekerProfileResponse>('/job-seeker/profile', {
      method: Methods.GET,
      next: { 
        tags: ['job-seeker-profile'],
        revalidate: 3600 // Cache for 1 hour, but can be invalidated with revalidateTag
      } 
    }),

  /**
   * Update job seeker personal information
   * @param data - Personal information update data
   * @returns Promise with updated profile response
   */
  updatePersonalInfo: (data: IUpdatePersonalInfoRequest): Promise<IUpdatePersonalInfoResponse> => {
    return authFetcher<IUpdatePersonalInfoResponse>('/job-seeker/profile/personal-info', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Update job seeker career information
   * @param data - Career information update data
   * @returns Promise with updated profile response
   */
  updateCareerInfo: (data: IUpdateCareerInfoRequest): Promise<IUpdateCareerInfoResponse> => {
    return authFetcher<IUpdateCareerInfoResponse>('/job-seeker/profile/career-info', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Update job seeker social links
   * @param data - Social links update data
   * @returns Promise with updated profile response
   */
  updateSocialLinks: (data: IUpdateSocialLinksRequest): Promise<IUpdateSocialLinksResponse> => {
    return authFetcher<IUpdateSocialLinksResponse>('/job-seeker/profile/social-links', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Update job seeker skills
   * @param data - Skills update data
   * @returns Promise with updated profile response
   */
  updateSkills: (data: IUpdateSkillsRequest): Promise<IUpdateSkillsResponse> => {
    console.log('[Job Seeker Repository] updateSkills - Input data:', JSON.stringify(data, null, 2));
    
    // Try sending with explicit Content-Type and Accept headers
    const body = JSON.stringify(data);
    console.log('[Job Seeker Repository] updateSkills - Request body:', body);
    
    return authFetcher<IUpdateSkillsResponse>('/job-seeker/profile/skills', {
      method: Methods.PUT,
      body: body
    });
  },

  /**
   * Update job seeker education history
   * @param data - Education history update data
   * @returns Promise with updated profile response
   */
  updateEducation: (data: IUpdateEducationRequest): Promise<IUpdateEducationResponse> => {
    return authFetcher<IUpdateEducationResponse>('/job-seeker/profile/education', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Update job seeker work experience
   * @param data - Work experience update data
   * @returns Promise with updated profile response
   */
  updateWorkExperience: (data: IUpdateWorkExperienceRequest): Promise<IUpdateWorkExperienceResponse> => {
    return authFetcher<IUpdateWorkExperienceResponse>('/job-seeker/profile/work-experience', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    });
  },

  /**
   * Search jobs with filters (public endpoint - no auth required)
   * @param filters - Search filters
   * @returns Promise with search results
   */
  searchJobs: (filters?: JobSearchFilters): Promise<JobSearchResponse> => {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.keyword) queryParams.append('keyword', filters.keyword);
      if (filters.location) queryParams.append('location', filters.location);
      if (filters.job_type) queryParams.append('job_type', filters.job_type);
      if (filters.category) queryParams.append('category', filters.category);
      if (filters.min_salary !== undefined) queryParams.append('min_salary', String(filters.min_salary));
      if (filters.page !== undefined) queryParams.append('page', String(filters.page));
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/job-seeker/jobs/search?${queryString}` : '/job-seeker/jobs/search';
    
    return authFetcher<JobSearchResponse>(url, {
      method: Methods.GET,
      cache: 'no-store',
    });
  },

  /**
   * Get matched jobs for authenticated job seeker
   * Returns paginated list ranked by match score
   * @param filters - Matched jobs filters
   * @returns Promise with matched jobs response
   */
  getMatchedJobs: (filters?: MatchedJobsFilters): Promise<MatchedJobsResponse> => {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.min_score !== undefined) queryParams.append('min_score', String(filters.min_score));
      if (filters.page !== undefined) queryParams.append('page', String(filters.page));
    }
    
    const queryString = queryParams.toString();
    const url = queryString ? `/job-seeker/matched-jobs?${queryString}` : '/job-seeker/matched-jobs';
    
    return authFetcher<MatchedJobsResponse>(url, {
      method: Methods.GET,
      cache: 'no-store',
    });
  },

  /**
   * Upload resume file
   * @param file - Resume file (PDF/DOC/DOCX, max 5MB)
   * @returns Promise with upload response containing resume_url
   */
  uploadResume: async (file: File): Promise<IUploadResumeResponse> => {
    // Create fresh FormData on server side
    const formData = new FormData();
    formData.append('resume', file);
    console.log('[Repository] Uploading file:', file.name, file.size, file.type);
    console.log('[Repository] FormData entry:', formData.get("resume"));
    
    // Don't set Content-Type header - let the fetch API set it with the correct boundary
    return authFetcher<IUploadResumeResponse>('/job-seeker/resume/upload', {
      method: Methods.POST,
      body: formData,
      skipDefaultHeaders: true, // This will prevent Content-Type from being set
    } as any); // Type assertion needed due to extended RequestInit
  },

  /**
   * Delete resume file
   * @returns Promise with delete response
   */
  deleteResume: (): Promise<IDeleteResumeResponse> => {
    return authFetcher<IDeleteResumeResponse>('/job-seeker/resume', {
      method: Methods.DELETE,
    });
  },

  /**
   * Update default cover letter
   * @param coverLetter - Cover letter text (max 2000 chars)
   * @returns Promise with update response
   */
  updateCoverLetter: (coverLetter: string): Promise<IUpdateCoverLetterResponse> => {
    return authFetcher<IUpdateCoverLetterResponse>('/job-seeker/cover-letter', {
      method: Methods.PUT,
      body: JSON.stringify({ cover_letter: coverLetter }),
    });
  },

  /**
   * Delete default cover letter
   * @returns Promise with delete response
   */
  deleteCoverLetter: (): Promise<IDeleteCoverLetterResponse> => {
    return authFetcher<IDeleteCoverLetterResponse>('/job-seeker/cover-letter', {
      method: Methods.DELETE,
    });
  },
};