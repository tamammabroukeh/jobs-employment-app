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
};
