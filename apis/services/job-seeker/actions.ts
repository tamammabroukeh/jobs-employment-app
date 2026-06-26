'use server';

import { actionClient } from '@/lib/safe-action';
import { ActionError } from '@/apis/types/error';
import { jobSeekerRepository } from './index';
import { IUpdateProfileRequest, IUpdatePersonalInfoRequest, IUpdateCareerInfoRequest, IUpdateSocialLinksRequest, IUpdateSkillsRequest, IUpdateEducationRequest, IUpdateWorkExperienceRequest } from './interface';
import { z } from 'zod';
import { revalidateTag } from 'next/cache';

// Update Personal Info Schema
const updatePersonalInfoSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  full_name: z.string().optional(),
  image: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  marital_status: z.string().optional(),
});

// Update Career Info Schema
const updateCareerInfoSchema = z.object({
  salary_range_from: z.number().optional(),
  salary_range_to: z.number().optional(),
  current_job_status: z.string().optional(),
  years_of_experience: z.number().optional(),
  education_level: z.string().optional(),
  job_level: z.string().optional(),
  job_types: z.array(z.string()).optional(),
  job_roles: z.array(z.string()).optional(),
  work_cities: z.array(z.string()).optional(),
  current_job_title: z.string().optional(),
  experience_summary: z.string().optional(),
  expected_salary: z.number().optional(),
  is_actively_seeking: z.boolean().optional(),
});

// Update Social Links Schema
const updateSocialLinksSchema = z.object({
  social_links: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    twitter: z.string().optional(),
  }),
});

// Update Skills Schema
const updateSkillsSchema = z.object({
  skills: z.array(z.object({
    name: z.string(),
    level: z.string(),
  })),
});

// Update Education Schema
const updateEducationSchema = z.object({
  education_history: z.array(z.object({
    certificate_type: z.string(),
    university: z.string(),
    faculty: z.string(),
    major: z.string(),
    major_name: z.string(),
    grade: z.string(),
    from_date: z.string(),
    awarded_date: z.string(),
  })),
});

// Update Work Experience Schema
const updateWorkExperienceSchema = z.object({
  work_experience: z.array(z.object({
    job_title: z.string(),
    company_name: z.string(),
    job_roles: z.array(z.string()),
    from_date: z.string(),
    to_date: z.string(),
    is_currently_working: z.boolean(),
    description: z.string(),
  })),
});

/**
 * Update Job Seeker Personal Information Action
 * Updates the authenticated user's personal information only
 */
export const updatePersonalInfoAction = actionClient
  .schema(updatePersonalInfoSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log('[Update Personal Info Action] ========== STARTING PERSONAL INFO UPDATE ==========');
      console.log('[Update Personal Info Action] Data keys:', Object.keys(data));
      console.log('[Update Personal Info Action] Data:', data);

      // Call the update personal info API
      const response = await jobSeekerRepository.updatePersonalInfo(data as IUpdatePersonalInfoRequest);
      console.log('[Update Personal Info Action] Response:', response);

      if (!response.profile) {
        console.error('[Update Personal Info Action] Update failed');
        throw new ActionError(response.message || 'Failed to update personal information');
      }

      // Revalidate the profile cache tag to refetch data on next request
      revalidateTag("job-seeker-profile", 'max');
      
      // Return success with updated profile data
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Update Personal Info Action] ========== EXCEPTION ==========');
      console.error('[Update Personal Info Action] Error:', error);

      // Extract more detailed error information
      if (error && typeof error === 'object' && 'info' in error) {
        console.error('[Update Personal Info Action] Error info:', error.info);
        const errorInfo = error.info as Record<string, string>;

        // Check if there's a message in the error info
        if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
          console.error('[Update Personal Info Action] API Error Message:', errorInfo.message);
          throw new ActionError(errorInfo.message || 'Failed to update personal information');
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update personal information. Please try again.');
    }
  });

/**
 * Update Job Seeker Career Information Action
 * Updates the authenticated user's career information only
 */
export const updateCareerInfoAction = actionClient
  .schema(updateCareerInfoSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log('[Update Career Info Action] ========== STARTING CAREER INFO UPDATE ==========');
      console.log('[Update Career Info Action] Data keys:', Object.keys(data));
      console.log('[Update Career Info Action] Data:', data);

      // Call the update career info API
      const response = await jobSeekerRepository.updateCareerInfo(data as IUpdateCareerInfoRequest);
      console.log('[Update Career Info Action] Response:', response);

      if (!response.profile) {
        console.error('[Update Career Info Action] Update failed');
        throw new ActionError(response.message || 'Failed to update career information');
      }

      // Revalidate the profile cache tag to refetch data on next request
      revalidateTag("job-seeker-profile", 'max');
      
      // Return success with updated profile data
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Update Career Info Action] ========== EXCEPTION ==========');
      console.error('[Update Career Info Action] Error:', error);

      // Extract more detailed error information
      if (error && typeof error === 'object' && 'info' in error) {
        console.error('[Update Career Info Action] Error info:', error.info);
        const errorInfo = error.info as Record<string, string>;

        // Check if there's a message in the error info
        if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
          console.error('[Update Career Info Action] API Error Message:', errorInfo.message);
          throw new ActionError(errorInfo.message || 'Failed to update career information');
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update career information. Please try again.');
    }
  });

/**
 * Update Job Seeker Social Links Action
 * Updates the authenticated user's social links only
 */
export const updateSocialLinksAction = actionClient
  .schema(updateSocialLinksSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log('[Update Social Links Action] ========== STARTING SOCIAL LINKS UPDATE ==========');
      console.log('[Update Social Links Action] Data keys:', Object.keys(data));
      console.log('[Update Social Links Action] Data:', data);

      // Call the update social links API
      const response = await jobSeekerRepository.updateSocialLinks(data as IUpdateSocialLinksRequest);
      console.log('[Update Social Links Action] Response:', response);

      if (!response.profile) {
        console.error('[Update Social Links Action] Update failed');
        throw new ActionError(response.message || 'Failed to update social links');
      }

      // Revalidate the profile cache tag to refetch data on next request
      revalidateTag("job-seeker-profile", 'max');
      
      // Return success with updated profile data
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Update Social Links Action] ========== EXCEPTION ==========');
      console.error('[Update Social Links Action] Error:', error);

      // Extract more detailed error information
      if (error && typeof error === 'object' && 'info' in error) {
        console.error('[Update Social Links Action] Error info:', error.info);
        const errorInfo = error.info as Record<string, string>;

        // Check if there's a message in the error info
        if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
          console.error('[Update Social Links Action] API Error Message:', errorInfo.message);
          throw new ActionError(errorInfo.message || 'Failed to update social links');
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update social links. Please try again.');
    }
  });

/**
 * Update Job Seeker Skills Action
 * Updates the authenticated user's skills only
 */
export const updateSkillsAction = actionClient
  .schema(updateSkillsSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log('[Update Skills Action] ========== STARTING SKILLS UPDATE ==========');
      console.log('[Update Skills Action] Data keys:', Object.keys(data));
      console.log('[Update Skills Action] Data:', JSON.stringify(data, null, 2));
      console.log('[Update Skills Action] Skills array:', data.skills);
      console.log('[Update Skills Action] Skills array length:', data.skills?.length);
      console.log('[Update Skills Action] Skills array JSON:', JSON.stringify(data.skills));

      // Call the update skills API
      const response = await jobSeekerRepository.updateSkills(data as IUpdateSkillsRequest);
      console.log('[Update Skills Action] Response:', response);

      if (!response.profile) {
        console.error('[Update Skills Action] Update failed');
        throw new ActionError(response.message || 'Failed to update skills');
      }

      // Revalidate the profile cache tag to refetch data on next request
      revalidateTag("job-seeker-profile", 'max');
      
      // Return success with updated profile data
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Update Skills Action] ========== EXCEPTION ==========');
      console.error('[Update Skills Action] Error:', error);

      // Extract more detailed error information
      if (error && typeof error === 'object' && 'info' in error) {
        console.error('[Update Skills Action] Error info:', error.info);
        const errorInfo = error.info as Record<string, string>;

        // Check if there's a message in the error info
        if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
          console.error('[Update Skills Action] API Error Message:', errorInfo.message);
          throw new ActionError(errorInfo.message || 'Failed to update skills');
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update skills. Please try again.');
    }
  });

/**
 * Update Job Seeker Education Action
 * Updates the authenticated user's education history only
 */
export const updateEducationAction = actionClient
  .schema(updateEducationSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log('[Update Education Action] ========== STARTING EDUCATION UPDATE ==========');
      console.log('[Update Education Action] Data keys:', Object.keys(data));
      console.log('[Update Education Action] Data:', data);

      // Call the update education API
      const response = await jobSeekerRepository.updateEducation(data as IUpdateEducationRequest);
      console.log('[Update Education Action] Response:', response);

      if (!response.profile) {
        console.error('[Update Education Action] Update failed');
        throw new ActionError(response.message || 'Failed to update education');
      }

      // Revalidate the profile cache tag to refetch data on next request
      revalidateTag("job-seeker-profile", 'max');
      
      // Return success with updated profile data
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Update Education Action] ========== EXCEPTION ==========');
      console.error('[Update Education Action] Error:', error);

      // Extract more detailed error information
      if (error && typeof error === 'object' && 'info' in error) {
        console.error('[Update Education Action] Error info:', error.info);
        const errorInfo = error.info as Record<string, string>;

        // Check if there's a message in the error info
        if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
          console.error('[Update Education Action] API Error Message:', errorInfo.message);
          throw new ActionError(errorInfo.message || 'Failed to update education');
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update education. Please try again.');
    }
  });

/**
 * Update Job Seeker Work Experience Action
 * Updates the authenticated user's work experience only
 */
export const updateWorkExperienceAction = actionClient
  .schema(updateWorkExperienceSchema)
  .action(async ({ parsedInput: data }) => {
    try {
      console.log('[Update Work Experience Action] ========== STARTING WORK EXPERIENCE UPDATE ==========');
      console.log('[Update Work Experience Action] Data keys:', Object.keys(data));
      console.log('[Update Work Experience Action] Data:', data);
      console.log('[Update Work Experience Action] JSON.stringify(data)', JSON.stringify(data));

      // Call the update work experience API
      const response = await jobSeekerRepository.updateWorkExperience(data);
      console.log('[Update Work Experience Action] Response:', response);

      if (!response.profile) {
        console.error('[Update Work Experience Action] Update failed');
        throw new ActionError(response.message || 'Failed to update work experience');
      }

      // Revalidate the profile cache tag to refetch data on next request
      revalidateTag("job-seeker-profile", 'max');
      
      // Return success with updated profile data
      return {
        success: true,
        message: response.message,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Update Work Experience Action] ========== EXCEPTION ==========');
      console.error('[Update Work Experience Action] Error:', error);

      // Extract more detailed error information
      if (error && typeof error === 'object' && 'info' in error) {
        console.error('[Update Work Experience Action] Error info:', error.info);
        const errorInfo = error.info as Record<string, string>;

        // Check if there's a message in the error info
        if (errorInfo && typeof errorInfo === 'object' && 'message' in errorInfo) {
          console.error('[Update Work Experience Action] API Error Message:', errorInfo.message);
          throw new ActionError(errorInfo.message || 'Failed to update work experience');
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to update work experience. Please try again.');
    }
  });


// Update Profile Schema
const updateProfileSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  full_name: z.string().optional(),
  image: z.string().optional(),
  gender: z.string().optional(),
  nationality: z.string().optional(),
  city: z.string().optional(),
  location: z.string().optional(),
  address: z.string().optional(),
  phone: z.string().optional(),
  date_of_birth: z.string().optional(),
  marital_status: z.string().optional(),
  salary_range_from: z.number().optional(),
  salary_range_to: z.number().optional(),
  current_job_status: z.string().optional(),
  years_of_experience: z.number().optional(),
  education_level: z.string().optional(),
  job_level: z.string().optional(),
  job_types: z.array(z.string()).optional(),
  job_roles: z.array(z.string()).optional(),
  work_cities: z.array(z.string()).optional(),
  current_job_title: z.string().optional(),
  experience_summary: z.string().optional(),
  expected_salary: z.number().optional(),
  is_actively_seeking: z.boolean().optional(),
  social_links: z.object({
    linkedin: z.string().optional(),
    github: z.string().optional(),
    portfolio: z.string().optional(),
    twitter: z.string().optional(),
  }).optional(),
  skills: z.array(z.object({
    name: z.string(),
    level: z.string(),
  })).optional(),
  education_history: z.array(z.object({
    certificate_type: z.string(),
    university: z.string(),
    faculty: z.string(),
    major: z.string(),
    major_name: z.string(),
    grade: z.string(),
    from_date: z.string(),
    awarded_date: z.string(),
  })).optional(),
  work_experience: z.array(z.object({
    job_title: z.string(),
    company_name: z.string(),
    job_roles: z.array(z.string()),
    from_date: z.string(),
    to_date: z.string(),
    is_currently_working: z.boolean(),
    description: z.string(),
  })).optional(),
});