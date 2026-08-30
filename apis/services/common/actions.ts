'use server';

import { commonRepository } from './index';
import type { IRole, ICity, ICategory } from './interface';

/**
 * Get all available job roles
 * Server action for fetching roles
 * 
 * @returns Promise with array of roles or empty array on error
 */
export async function getRolesAction(): Promise<IRole[]> {
  try {
    const response = await commonRepository.getRoles();
    return response.data;
  } catch (error) {
    console.error('Get roles error:', error);
    return [];
  }
}

/**
 * Get all available cities
 * Server action for fetching cities
 * 
 * @returns Promise with array of cities or empty array on error
 */
export async function getCitiesAction(): Promise<ICity[]> {
  try {
    const response = await commonRepository.getCities();
    return response.data;
  } catch (error) {
    console.error('Get cities error:', error);
    return [];
  }
}

/**
 * Get all available categories
 * Server action for fetching categories
 * 
 * @returns Promise with array of categories or empty array on error
 */
export async function getCategoriesAction(): Promise<ICategory[]> {
  try {
    const response = await commonRepository.getCategories();
    return response.data;
  } catch (error) {
    console.error('Get categories error:', error);
    return [];
  }
}
