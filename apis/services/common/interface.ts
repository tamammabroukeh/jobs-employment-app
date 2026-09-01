/**
 * Common API Interfaces
 * Shared interfaces for roles, cities, categories, and other common data
 */

/**
 * Role Interface
 */
export interface IRole {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * City Interface
 */
export interface ICity {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Category Interface
 */
export interface ICategory {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

/**
 * Roles Response
 */
export interface IRolesResponse {
  data: IRole[];
}

/**
 * Cities Response
 */
export interface ICitiesResponse {
  data: ICity[];
}

/**
 * Categories Response
 */
export interface ICategoriesResponse {
  data: ICategory[];
}

/**
 * Education Lookup Item Interface
 * Generic interface for universities, faculties, and majors
 */
export interface IEducationLookupItem {
  _id: string;
  name: string;
}

/**
 * Education Lookup Response
 * Response for universities, faculties, and majors endpoints
 */
export interface IEducationLookupResponse {
  data: IEducationLookupItem[];
}
