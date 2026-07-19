'use server';

import { jobsRepository } from './index';
import type { Job } from './interfaces';

/**
 * Get job details by ID
 * Server action for fetching single job details
 * 
 * @param id - Job ID
 * @returns Promise with job data or null if not found
 */
export async function getJobByIdAction(id: string): Promise<Job | null> {
  try {
    const job = await jobsRepository.getJobById(id);
    return job;
  } catch (error) {
    console.error('Get job by ID error:', error);
    return null;
  }
}
