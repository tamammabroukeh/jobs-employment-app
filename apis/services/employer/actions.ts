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
  salary_from: z.string().min(1, "Minimum salary is required"),
  salary_to: z.string().min(1, "Maximum salary is required"),
  currency: z.string().min(1, "Currency is required"),
  display_salary: z.boolean(),
  incentives: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(10, "Requirements must be at least 10 characters"),
  questions: z.array(z.object({
    question: z.string(),
    required: z.string(),
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

      if (!response.data) {
        console.error('[Update Job Action] Update failed');
        throw new Error(response.message || 'Failed to update job');
      }

      // Revalidate the manage jobs page
      revalidatePath("/manage-jobs");
      revalidatePath(`/forsa/${id}`);

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

// Update Company Profile Action
const updateCompanySchema = z.object({
  name: z.string().min(1, "Company name is required").max(150, "Company name must be at most 150 characters").optional(),
  description: z.string().optional(),
  industry: z.string().optional(),
  company_size: z.enum(['less_than_10', '10_to_50', '51_to_200', '201_to_500', '501_to_1000', '1001_to_5000', 'more_than_5000']).optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  phone_visible: z.boolean().optional(),
  email: z.string().email("Invalid email format").optional(),
});

export const updateCompanyProfileAction = actionClient
  .schema(updateCompanySchema)
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
