import { authFetcher } from '@/apis/authInstace';
import { Methods } from '@/constants/methods';
import { IJobSeekerProfileResponse, IUpdateProfileRequest, IUpdateProfileResponse, IUpdatePersonalInfoRequest, IUpdatePersonalInfoResponse, IUpdateCareerInfoRequest, IUpdateCareerInfoResponse, IUpdateSocialLinksRequest, IUpdateSocialLinksResponse, IUpdateSkillsRequest, IUpdateSkillsResponse, IUpdateEducationRequest, IUpdateEducationResponse, IUpdateWorkExperienceRequest, IUpdateWorkExperienceResponse } from './interface';

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
};