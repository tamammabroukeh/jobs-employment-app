"use server";

import { actionClient } from "@/lib/safe-action";
import { z } from "zod";
import type {
  CreateJobRequest,
} from "./interface";
import { revalidatePath, revalidateTag } from "next/cache";
import { employerRepository } from "./index";

// Validation schema matching the new API structure
const createJobSchema = z.object({
  communication_method: z.string().min(1, "Communication method is required"),
  communication_value: z.string().nullable().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  roles: z.array(z.string()).min(1, "At least one role is required"),
  portfolio_required: z.boolean(),
  cover_letter_required: z.boolean(),
  gender: z.string().min(1, "Gender preference is required"),
  age_from: z.number().nullable().optional(),
  age_to: z.number().nullable().optional(),
  education_level: z.string().min(1, "Education level is required"),
  job_level: z.string().min(1, "Job level is required"),
  experience_years: z.number().min(0, "Experience years must be positive"),
  languages: z.array(z.string()).min(1, "At least one language is required"),
  vacancies: z.number().min(1, "At least one vacancy is required"),
  job_type: z.string().min(1, "Job type is required"),
  work_mode: z.string().min(1, "Work mode is required"),
  city: z.string().min(2, "City is required"),
  address: z.string().min(5, "Address is required"),
  salary_from: z.number().min(0, "Minimum salary must be positive"),
  salary_to: z.number().min(0, "Maximum salary must be positive"),
  currency: z.string().min(1, "Currency is required"),
  display_salary: z.boolean(),
  incentives: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  questions: z.array(z.object({
    question: z.string(),
    required: z.boolean(),
  })).optional(),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  category: z.string().min(1, "Category is required"),
  expires_at: z.string().min(1, "Expiry date is required"),
});

const updateJobSchema = createJobSchema.partial().extend({
  id: z.string().min(1, "Job ID is required"),
});

// Create Job Action
export const createJobAction = actionClient
  .schema(createJobSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Create Job Action] ========== STARTING JOB CREATE ==========');
      console.log('[Create Job Action] Data keys:', Object.keys(parsedInput));
      console.log('[Create Job Action] Data:', parsedInput);

      const response = await employerRepository.createJob(parsedInput as CreateJobRequest);
      console.log('[Create Job Action] Response:', response);

      if (!response) {
        console.error('[Create Job Action] Create failed');
        throw new Error('Failed to create job');
      }

      // Revalidate the manage jobs page
      revalidatePath("/manage-jobs");

      return {
        success: true,
        message: response.message || "Job created successfully",
        data: response,
      };
    } catch (error) {
      console.error('[Create Job Action] ========== EXCEPTION ==========');
      console.error('[Create Job Action] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to create job');
      }
      throw new Error('Failed to create job. Please try again.');
    }
  });

// Update Job Action
export const updateJobAction = actionClient
  .schema(updateJobSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Update Job Action] ========== STARTING JOB UPDATE ==========');
      console.log('[Update Job Action] Data keys:', Object.keys(parsedInput));
      console.log('[Update Job Action] Data:', parsedInput);

      const { id, ...updateData } = parsedInput;

      const response = await employerRepository.updateJob(id, updateData as Partial<CreateJobRequest>);
      console.log('[Update Job Action] Response:', response);

      if (!response) {
        console.error('[Update Job Action] Update failed');
        throw new Error('Failed to update job');
      }

      // Revalidate the manage jobs page
      revalidateTag('job-by-id', 'max');

      return {
        success: true,
        message: response.message || "Job updated successfully",
        data: response.data,
      };
    } catch (error) {
      console.error('[Update Job Action] ========== EXCEPTION ==========');
      console.error('[Update Job Action] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to update job');
      }
      throw new Error('Failed to update job. Please try again.');
    }
  });

// Delete Job Action
export const deleteJobAction = actionClient
  .schema(z.object({ id: z.string().min(1, "Job ID is required") }))
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Delete Job Action] ========== STARTING JOB DELETE ==========');
      console.log('[Delete Job Action] Job ID:', parsedInput.id);

      const response = await employerRepository.deleteJob(parsedInput.id);
      console.log('[Delete Job Action] Response:', response);

      // Revalidate the manage jobs page
      revalidatePath("/manage-jobs");

      return {
        success: true,
        message: response.message || "Job deleted successfully",
      };
    } catch (error) {
      console.error('[Delete Job Action] ========== EXCEPTION ==========');
      console.error('[Delete Job Action] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to delete job');
      }
      throw new Error('Failed to delete job. Please try again.');
    }
  });

// Get Company Profile Action
export const getCompanyProfileAction = async () => {
  try {
    console.log('[Get Company Profile] ========== FETCHING COMPANY PROFILE ==========');
    
    const response = await employerRepository.getCompanyProfile();
    console.log('[Get Company Profile] Response:', response);

    if (!response) {
      console.error('[Get Company Profile] Fetch failed');
      throw new Error('Failed to fetch company profile');
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('[Get Company Profile] ========== EXCEPTION ==========');
    console.error('[Get Company Profile] Error:', error);

    if (error instanceof Error) {
      throw new Error(error.message || 'Failed to fetch company profile');
    }
    throw new Error('Failed to fetch company profile. Please try again.');
  }
};

// Activate Job Action
export const activateJobAction = actionClient
  .schema(z.object({ id: z.string().min(1, "Job ID is required") }))
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Activate Job Action] ========== STARTING JOB ACTIVATE ==========');
      console.log('[Activate Job Action] Job ID:', parsedInput.id);

      const response = await employerRepository.activateJob(parsedInput.id);
      console.log('[Activate Job Action] Response:', response);

      // Revalidate the manage jobs page
      revalidatePath("/manage-jobs");

      return {
        success: true,
        message: response.message || "Job activated successfully",
      };
    } catch (error) {
      console.error('[Activate Job Action] ========== EXCEPTION ==========');
      console.error('[Activate Job Action] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to activate job');
      }
      throw new Error('Failed to activate job. Please try again.');
    }
  });

// Deactivate Job Action
export const deactivateJobAction = actionClient
  .schema(z.object({ id: z.string().min(1, "Job ID is required") }))
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Deactivate Job Action] ========== STARTING JOB DEACTIVATE ==========');
      console.log('[Deactivate Job Action] Job ID:', parsedInput.id);

      const response = await employerRepository.deactivateJob(parsedInput.id);
      console.log('[Deactivate Job Action] Response:', response);

      // Revalidate the manage jobs page
      revalidatePath("/manage-jobs");

      return {
        success: true,
        message: response.message || "Job deactivated successfully",
      };
    } catch (error) {
      console.error('[Deactivate Job Action] ========== EXCEPTION ==========');
      console.error('[Deactivate Job Action] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to deactivate job');
      }
      throw new Error('Failed to deactivate job. Please try again.');
    }
  });

// Update Company Profile Action (Public Info)
const updateCompanyPublicSchema = z.object({
  name: z.string().min(1, "Company name is required").max(150, "Company name must be at most 150 characters").optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.enum(['less_than_10', '10_to_50', '51_to_200', '201_to_500', '501_to_1000', '1001_to_5000', 'more_than_5000']).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone_main: z.string().optional(),
  phone_extra: z.string().optional(),
  phone_visible: z.boolean().optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const updateCompanyProfileAction = actionClient
  .schema(updateCompanyPublicSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Update Company Profile] ========== STARTING COMPANY UPDATE ==========');
      console.log('[Update Company Profile] Data:', parsedInput);

      const response = await employerRepository.updateCompanyProfile(parsedInput);
      console.log('[Update Company Profile] Response:', response);

      if (!response) {
        console.error('[Update Company Profile] Update failed');
        throw new Error('Failed to update company profile');
      }
      
      // Revalidate the employer profile page
      revalidateTag("employer-profile", "max");
      
      console.log('[Update Company Profile] Update success');
      return {
        success: true,
        message: "Company profile updated successfully",
        data: response,
      };
    } catch (error) {
      console.error('[Update Company Profile] ========== EXCEPTION ==========');
      console.error('[Update Company Profile] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to update company profile');
      }
      throw new Error('Failed to update company profile. Please try again.');
    }
  });

// Update Company Private Info Action
const updateCompanyPrivateSchema = z.object({
  expose_to_applicants: z.boolean().optional(),
  address: z.string().optional(),
  industry_tags: z.array(z.string()).optional(),
  founded_year: z.number().min(1800, "Invalid year").max(new Date().getFullYear(), "Year cannot be in the future").optional(),
  website: z.string().url("Invalid URL").optional(),
  social_media: z.object({
    linkedin: z.string().url("Invalid LinkedIn URL").optional().nullable(),
    github: z.string().url("Invalid GitHub URL").optional().nullable(),
    twitter: z.string().url("Invalid Twitter URL").optional().nullable(),
    facebook: z.string().url("Invalid Facebook URL").optional().nullable(),
    instagram: z.string().url("Invalid Instagram URL").optional().nullable(),
    telegram: z.string().url("Invalid Telegram URL").optional().nullable(),
    behance: z.string().url("Invalid Behance URL").optional().nullable(),
  }).optional(),
});

export const updateCompanyPrivateInfoAction = actionClient
  .schema(updateCompanyPrivateSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Update Company Private Info] ========== STARTING PRIVATE INFO UPDATE ==========');
      console.log('[Update Company Private Info] Data:', parsedInput);

      const response = await employerRepository.updateCompanyPrivateInfo(parsedInput);
      console.log('[Update Company Private Info] Response:', response);

      if (!response) {
        console.error('[Update Company Private Info] Update failed');
        throw new Error('Failed to update company private information');
      }
      
      // Revalidate the employer profile page
      revalidateTag("employer-profile", "max");
      
      console.log('[Update Company Private Info] Update success');
      return {
        success: true,
        message: "Company private information updated successfully",
        data: response,
      };
    } catch (error) {
      console.error('[Update Company Private Info] ========== EXCEPTION ==========');
      console.error('[Update Company Private Info] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to update company private information');
      }
      throw new Error('Failed to update company private information. Please try again.');
    }
  });

// Upload Company Logo Action
const uploadLogoSchema = z.object({
  logo: z.instanceof(File)
    .refine(
      (file) => file.size <= 2 * 1024 * 1024,
      'Logo file size must be less than 2MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Logo must be JPEG, PNG, or WebP'
    ),
});

export const uploadCompanyLogoAction = actionClient
  .schema(uploadLogoSchema)
  .action(async ({ parsedInput: { logo } }) => {
    try {
      console.log('[Upload Company Logo] ========== STARTING LOGO UPLOAD ==========');
      console.log('[Upload Company Logo] File:', { name: logo.name, size: logo.size, type: logo.type });

      const response = await employerRepository.uploadCompanyLogo(logo);
      console.log('[Upload Company Logo] Response:', response);

      if (!response) {
        console.error('[Upload Company Logo] Upload failed');
        throw new Error('Failed to upload company logo');
      }
      
      // Revalidate the employer profile page
      revalidateTag("employer-profile", "max");
      
      console.log('[Upload Company Logo] Upload success');
      return {
        success: true,
        message: "Company logo uploaded successfully",
        data: response,
      };
    } catch (error) {
      console.error('[Upload Company Logo] ========== EXCEPTION ==========');
      console.error('[Upload Company Logo] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to upload company logo');
      }
      throw new Error('Failed to upload company logo. Please try again.');
    }
  });

// Upload Company Cover Image Action
const uploadCoverImageSchema = z.object({
  cover_image: z.instanceof(File)
    .refine(
      (file) => file.size <= 4 * 1024 * 1024,
      'Cover image file size must be less than 4MB'
    )
    .refine(
      (file) => ['image/jpeg', 'image/png', 'image/webp'].includes(file.type),
      'Cover image must be JPEG, PNG, or WebP'
    ),
});

export const uploadCompanyCoverImageAction = actionClient
  .schema(uploadCoverImageSchema)
  .action(async ({ parsedInput: { cover_image } }) => {
    try {
      console.log('[Upload Company Cover Image] ========== STARTING COVER IMAGE UPLOAD ==========');
      console.log('[Upload Company Cover Image] File:', { name: cover_image.name, size: cover_image.size, type: cover_image.type });

      const response = await employerRepository.uploadCompanyCoverImage(cover_image);
      console.log('[Upload Company Cover Image] Response:', response);

      if (!response) {
        console.error('[Upload Company Cover Image] Upload failed');
        throw new Error('Failed to upload company cover image');
      }
      
      // Revalidate the employer profile page
      revalidateTag("employer-profile", "max");
      
      console.log('[Upload Company Cover Image] Upload success');
      return {
        success: true,
        message: response || "Company cover image uploaded successfully",
        data: response,
      };
    } catch (error) {
      console.error('[Upload Company Cover Image] ========== EXCEPTION ==========');
      console.error('[Upload Company Cover Image] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to upload company cover image');
      }
      throw new Error('Failed to upload company cover image. Please try again.');
    }
  });

// Update Application Status Action
const updateApplicationStatusSchema = z.object({
  id: z.string().min(1, "Application ID is required"),
  status: z.enum(['pending', 'reviewed', 'accepted', 'rejected'], {
    message: "Status must be one of: pending, reviewed, accepted, rejected"
  }),
  feedback: z.string().max(2000, "Feedback must be at most 2000 characters").optional(),
});

export const updateApplicationStatusAction = actionClient
  .schema(updateApplicationStatusSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Update Application Status] ========== STARTING STATUS UPDATE ==========');
      console.log('[Update Application Status] Data:', parsedInput);

      const { id, status, feedback } = parsedInput;
      const response = await employerRepository.updateApplicationStatus(id, status, feedback);
      console.log('[Update Application Status] Response:', response);

      if (!response) {
        console.error('[Update Application Status] Update failed');
        throw new Error('Failed to update application status');
      }

      // Revalidate applications data
      revalidatePath("/manage-jobs");

      return {
        success: true,
        message: response.message || "Application status updated successfully",
        data: response.data,
      };
    } catch (error) {
      console.error('[Update Application Status] ========== EXCEPTION ==========');
      console.error('[Update Application Status] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to update application status');
      }
      throw new Error('Failed to update application status. Please try again.');
    }
  });

// Send Offer Action
const sendOfferSchema = z.object({
  job_seeker_id: z.string().min(1, "Job seeker ID is required"),
  job_post_id: z.string().min(1, "Job post ID is required"),
  message: z.string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be at most 1000 characters"),
});

export const sendOfferAction = actionClient
  .schema(sendOfferSchema)
  .action(async ({ parsedInput }) => {
    try {
      console.log('[Send Offer] ========== STARTING SEND OFFER ==========');
      console.log('[Send Offer] Data:', parsedInput);

      const { job_seeker_id, job_post_id, message } = parsedInput;
      const response = await employerRepository.sendOffer(job_seeker_id, job_post_id, message);
      console.log('[Send Offer] Response:', response);

      if (!response) {
        console.error('[Send Offer] Send failed');
        throw new Error('Failed to send offer');
      }

      return {
        success: true,
        message: response.message || "Offer sent successfully",
        data: response.data,
      };
    } catch (error) {
      console.error('[Send Offer] ========== EXCEPTION ==========');
      console.error('[Send Offer] Error:', error);

      if (error instanceof Error) {
        throw new Error(error.message || 'Failed to send offer');
      }
      throw new Error('Failed to send offer. Please try again.');
    }
  });

