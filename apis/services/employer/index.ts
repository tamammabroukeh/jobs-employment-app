export * from "./interface";
export * from "./actions";

import { authFetcher } from '@/apis/authInstace';
import { Methods } from '@/constants/methods';
import { buildQueryString } from '@/apis/utils/queryBuilder';
import type {
  CreateJobRequest,
  CreateJobResponse,
  UpdateJobResponse,
  EmployerJobsResponse,
  DeleteJobResponse,
  Job,
  CompanyProfile,
  UpdateCompanyRequest,
  CompanyProfileResponse,
  CandidatesResponse,
  CandidatesQueryParams,
  CandidateDetailResponse,
  JobApplicationsResponse,
  UpdateApplicationStatusResponse,
} from './interface';

/**
 * Employer API Repository
 * Handles all employer-related API calls
 */
export const employerRepository = {
  /**
   * Get employer jobs
   * @param page - Page number
   * @param limit - Items per page
   * @returns Promise with employer jobs response
   */
  getJobs: (page: number = 1, limit: number = 10): Promise<Job[]> =>
    authFetcher<Job[]>(`/employer/jobs?page=${page}&limit=${limit}`, {
      method: Methods.GET,
      cache: "no-store",
    }),

  /**
   * Get single job
   * @param id - Job ID
   * @returns Promise with job data
   */
  getJob: (id: string): Promise<Job> =>
    authFetcher<Job>(`/jobs/${id}`, {
      method: Methods.GET,
      cache: "no-store",
      next:{
        tags: ['job-by-id'],
        revalidate:3600
      }
    }),

  /**
   * Create new job
   * @param data - Job creation data
   * @returns Promise with created job response
   */
  createJob: (data: CreateJobRequest): Promise<CreateJobResponse> =>
    authFetcher<CreateJobResponse>('/employer/jobs', {
      method: Methods.POST,
      body: JSON.stringify(data),
    }),

  /**
   * Update existing job
   * @param id - Job ID
   * @param data - Job update data
   * @returns Promise with updated job response
   */
  updateJob: (id: string, data: Partial<CreateJobRequest>): Promise<UpdateJobResponse> =>
    authFetcher<UpdateJobResponse>(`/employer/jobs/${id}`, {
      method: Methods.PUT,
      body: JSON.stringify(data),
    }),

  /**
   * Delete job
   * @param id - Job ID
   * @returns Promise with delete response
   */
  deleteJob: (id: string): Promise<DeleteJobResponse> =>
    authFetcher<DeleteJobResponse>(`/employer/jobs/${id}`, {
      method: Methods.DELETE,
    }),

  /**
   * Get company profile
   * @returns Promise with company profile data
   */
  getCompanyProfile: (): Promise<CompanyProfile> =>
    authFetcher<CompanyProfile>('/employer/company', {
      method: Methods.GET,
      cache: "no-store",
      next: { 
        tags: ['employer-profile'],
        revalidate: 3600
      } 
    }),

  /**
   * Update company profile
   * @param data - Company update data
   * @returns Promise with updated company profile
   */
  updateCompanyProfile: (data: UpdateCompanyRequest): Promise<CompanyProfile> =>
    authFetcher<CompanyProfile>('/employer/company', {
      method: Methods.PUT,
      body: JSON.stringify(data),
    }),

  /**
   * Get candidates/seekers
   * @param params - Query parameters for filtering and pagination
   * @returns Promise with candidates response
   */
  getCandidates: (params: CandidatesQueryParams = {}): Promise<CandidatesResponse> => {
    const queryString = buildQueryString(params);
    const endpoint = queryString ? `/employer/seekers?${queryString}` : '/employer/seekers';
    return authFetcher<CandidatesResponse>(endpoint, {
      method: Methods.GET,
      cache: "no-store",
    });
  },

  /**
   * Get candidate detail by user ID
   * @param userId - User ID of the candidate
   * @returns Promise with candidate detail response
   */
  getCandidateDetail: (userId: string): Promise<CandidateDetailResponse> =>
    authFetcher<CandidateDetailResponse>(`/employer/seekers/${userId}`, {
      method: Methods.GET,
      cache: "no-store",
      next: {
        tags: ['candidate-detail'],
        revalidate: 3600
      }
    }),

  /**
   * Activate a job post
   * @param id - Job ID
   * @returns Promise with activation response
   */
  activateJob: (id: string): Promise<{ message: string }> =>
    authFetcher<{ message: string }>(`/employer/jobs/${id}/activate`, {
      method: Methods.POST,
    }),

  /**
   * Deactivate a job post
   * @param id - Job ID
   * @returns Promise with deactivation response
   */
  deactivateJob: (id: string): Promise<{ message: string }> =>
    authFetcher<{ message: string }>(`/employer/jobs/${id}/deactivate`, {
      method: Methods.POST,
    }),

  /**
   * Get job applications for a specific job
   * @param jobId - Job ID
   * @param page - Page number (default: 1)
   * @param per_page - Items per page (default: 15)
   * @returns Promise with job applications response
   */
  getJobApplications: (jobId: string, page: number = 1, per_page: number = 15): Promise<JobApplicationsResponse> =>
    authFetcher<JobApplicationsResponse>(`/employer/jobs/${jobId}/applications?page=${page}&per_page=${per_page}`, {
      method: Methods.GET,
      cache: "no-store",
    }),

  /**
   * Update application status
   * @param id - Application ID
   * @param status - New status
   * @param feedback - Optional feedback message
   * @returns Promise with update response
   */
  updateApplicationStatus: (id: string, status: string, feedback?: string): Promise<UpdateApplicationStatusResponse> =>
    authFetcher<UpdateApplicationStatusResponse>(`/employer/applications/${id}/status`, {
      method: Methods.PUT,
      body: JSON.stringify({ status, feedback }),
    }),
};
