'use server';

import { jobsRepository } from './index';
import type { Job, CategoryStat, LocationStat } from './interfaces';

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

/**
 * Get active job counts grouped by category
 * Server action for fetching category statistics
 * 
 * @returns Promise with array of category stats or empty array on error
 */
export async function getCategoryStatsAction(): Promise<CategoryStat[]> {
  try {
    const response = await jobsRepository.getCategoryStats();
    return response.data;
  } catch (error) {
    console.error('Get category stats error:', error);
    return [];
  }
}

/**
 * Get active job counts grouped by city
 * Server action for fetching location statistics
 * 
 * @returns Promise with array of location stats or empty array on error
 */
export async function getLocationStatsAction(): Promise<LocationStat[]> {
  try {
    const response = await jobsRepository.getLocationStats();
    return response.data;
  } catch (error) {
    console.error('Get location stats error:', error);
    return [];
  }
}
