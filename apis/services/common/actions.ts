'use server';

import { commonRepository } from './index';
import type { IRole, ICity, ICategory, IEducationLookupItem } from './interface';

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

/**
 * Get universities list
 * Server action for fetching universities
 * No authentication required
 * 
 * @returns Promise with array of universities or empty array on error
 */
export async function getUniversitiesAction(): Promise<IEducationLookupItem[]> {
  try {
    const response = await commonRepository.getEducationLookup('universities');
    return response.data;
  } catch (error) {
    console.error('Get universities error:', error);
    return [];
  }
}

/**
 * Get faculties list
 * Server action for fetching faculties
 * No authentication required
 * 
 * @returns Promise with array of faculties or empty array on error
 */
export async function getFacultiesAction(): Promise<IEducationLookupItem[]> {
  try {
    const response = await commonRepository.getEducationLookup('faculties');
    return response.data;
  } catch (error) {
    console.error('Get faculties error:', error);
    return [];
  }
}

/**
 * Get majors list
 * Server action for fetching majors
 * No authentication required
 * 
 * @returns Promise with array of majors or empty array on error
 */
export async function getMajorsAction(): Promise<IEducationLookupItem[]> {
  try {
    const response = await commonRepository.getEducationLookup('majors');
    return response.data;
  } catch (error) {
    console.error('Get majors error:', error);
    return [];
  }
}
