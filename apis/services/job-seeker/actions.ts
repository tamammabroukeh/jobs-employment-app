'use server';

import { actionClient } from '@/lib/safe-action';
import { ActionError } from '@/apis/types/error';
import { jobSeekerRepository } from './index';
import { IUpdatePersonalInfoRequest, IUpdateCareerInfoRequest, IUpdateSocialLinksRequest, IUpdateSkillsRequest, IUpdateEducationRequest } from './interface';
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


// Upload Resume Schema - expects the actual file
const uploadResumeSchema = z.object({
  file: z.instanceof(File),
});

// Update Cover Letter Schema
const updateCoverLetterSchema = z.object({
  cover_letter: z.string().max(2000, 'Cover letter must be less than 2000 characters'),
});

/**
 * Upload Resume Action
 * Uploads a resume file without triggering AI analysis
 */
export const uploadResumeAction = actionClient
  .schema(uploadResumeSchema)
  .action(async ({ parsedInput: { file } }) => {
    try {
      console.log('[Upload Resume Action] ========== STARTING RESUME UPLOAD ==========');
      
      if (!file) {
        throw new ActionError('No file provided');
      }

      console.log('[Upload Resume Action] File name:', file.name);
      console.log('[Upload Resume Action] File size:', file.size);
      console.log('[Upload Resume Action] File type:', file.type);

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        throw new ActionError('File size must be less than 5MB');
      }

      // Validate file type
      const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      ];
      if (!validTypes.includes(file.type)) {
        throw new ActionError('File must be PDF, DOC, or DOCX');
      }

      const response = await jobSeekerRepository.uploadResume(file);
      console.log('[Upload Resume Action] Response:', response);

      // Revalidate the profile cache to refetch with new resume URL
      revalidateTag("job-seeker-profile", 'max');

      return {
        success: true,
        message: response.message,
        resume_url: response.resume_url,
        analysis_status: response.analysis_status,
        profile: response.profile,
      };
    } catch (error) {
      console.error('[Upload Resume Action] ========== EXCEPTION ==========');
      console.error('[Upload Resume Action] Error:', error);

      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload resume';
      throw new ActionError(errorMessage);
    }
  });

/**
 * Delete Resume Action
 * Removes the stored resume file
 */
export const deleteResumeAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      console.log('[Delete Resume Action] ========== STARTING RESUME DELETE ==========');

      const response = await jobSeekerRepository.deleteResume();
      console.log('[Delete Resume Action] Response:', response);

      // Revalidate the profile cache
      revalidateTag("job-seeker-profile", 'max');

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('[Delete Resume Action] ========== EXCEPTION ==========');
      console.error('[Delete Resume Action] Error:', error);

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to delete resume. Please try again.');
    }
  });

/**
 * Update Cover Letter Action
 * Saves a default cover letter on the profile
 */
export const updateCoverLetterAction = actionClient
  .schema(updateCoverLetterSchema)
  .action(async ({ parsedInput: { cover_letter } }) => {
    try {
      console.log('[Update Cover Letter Action] ========== STARTING COVER LETTER UPDATE ==========');
      console.log('[Update Cover Letter Action] Cover letter length:', cover_letter.length);

      const response = await jobSeekerRepository.updateCoverLetter(cover_letter);
      console.log('[Update Cover Letter Action] Response:', response);

      // Revalidate the profile cache
      revalidateTag("job-seeker-profile", 'max');

      return {
        success: true,
        message: response.message,
        cover_letter: response.cover_letter,
      };
    } catch (error) {
      console.error('[Update Cover Letter Action] ========== EXCEPTION ==========');
      console.error('[Update Cover Letter Action] Error:', error);

      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error ? error.message : 'Failed to update cover letter';
      throw new ActionError(errorMessage);
    }
  });

/**
 * Delete Cover Letter Action
 * Removes the saved default cover letter
 */
export const deleteCoverLetterAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      console.log('[Delete Cover Letter Action] ========== STARTING COVER LETTER DELETE ==========');

      const response = await jobSeekerRepository.deleteCoverLetter();
      console.log('[Delete Cover Letter Action] Response:', response);

      // Revalidate the profile cache
      revalidateTag("job-seeker-profile", 'max');

      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('[Delete Cover Letter Action] ========== EXCEPTION ==========');
      console.error('[Delete Cover Letter Action] Error:', error);

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to delete cover letter. Please try again.');
    }
  });

// Apply Job Schema
const applyJobSchema = z.object({
  job_post_id: z.string().min(1, 'Job ID is required'),
  cover_letter: z.string().max(1000, 'Cover letter must not exceed 1000 characters').optional(),
  resume: z.instanceof(File).refine(
    (file) => file.size <= 5 * 1024 * 1024,
    'File size must be less than 5MB'
  ).refine(
    (file) => ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type),
    'File must be PDF, DOC, or DOCX'
  ).optional(),
  education: z.string().max(255).optional(),
  last_work: z.string().max(255).optional(),
  years_of_experience: z.number().min(0).max(60).optional(),
  why_join: z.string().max(2000).optional(),
  what_to_add: z.string().max(2000).optional(),
  positions_suited_for: z.array(z.string().max(100)).optional(),
  notice_period: z.string().max(100).optional(),
  expected_salary: z.string().max(100).optional(),
});

/**
 * Apply for a job
 * Server action for submitting job application
 */
export const applyForJobAction = actionClient
  .schema(applyJobSchema)
  .action(async ({ parsedInput }) => {
    try {
      const response = await jobSeekerRepository.applyForJob(parsedInput);
      console.log('response', response)
      return {
        success: response.status,
        message: response.message,
        application_id: response.application_id,
      };
    } catch (error) {
      console.error('Apply for job error:', error);
      
      if (error instanceof ActionError) throw error;
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Failed to submit application';
      throw new ActionError(errorMessage);
    }
  });

// Withdraw Application Schema
const withdrawApplicationSchema = z.object({
  id: z.string().min(1, 'Application ID is required'),
});

/**
 * Withdraw a pending job application
 * Only pending applications can be withdrawn; accepted ones cannot.
 */
export const withdrawApplicationAction = actionClient
  .schema(withdrawApplicationSchema)
  .action(async ({ parsedInput: { id } }) => {
    try {
      const response = await jobSeekerRepository.withdrawApplication(id);
      revalidateTag('job-applications', 'max');
      return {
        success: true,
        message: response.message,
      };
    } catch (error) {
      console.error('[Withdraw Application Action] Error:', error);

      if (error && typeof error === 'object' && 'info' in error) {
        const errorInfo = error.info as Record<string, string>;
        if (errorInfo?.message) {
          throw new ActionError(errorInfo.message);
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to withdraw application. Please try again.');
    }
  });

/**
 * Get Resume AI Analysis Status
 * Fetches the current analysis status and AI-extracted data from resume
 */
export const getResumeAnalysisStatusAction = actionClient
  .schema(z.object({}))
  .action(async () => {
    try {
      const response = await jobSeekerRepository.getResumeAnalysisStatus();
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('[Get Resume Analysis Status Action] Error:', error);

      if (error && typeof error === 'object' && 'info' in error) {
        const errorInfo = error.info as Record<string, string>;
        if (errorInfo?.message) {
          throw new ActionError(errorInfo.message);
        }
      }

      if (error instanceof ActionError) throw error;
      throw new ActionError('Failed to fetch resume analysis. Please try again.');
    }
  });
