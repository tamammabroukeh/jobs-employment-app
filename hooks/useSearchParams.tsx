import { useCallback } from 'react';
import {usePathname, useRouter} from "next/navigation"
/**
 * Custom hook for managing URL search parameters
 * @returns {{
 *   searchParams: {
        * searchParams: URLSearchParams;
        * getParam: (key: string) => string | null;
        * setParam: (key: string, value: string) => void;
        * deleteParam: (key: string) => void;
        * getAllParams: () => Record<string, string>;
        * clearAllParams: () => void;
    * },
 *   getParam: (key: string) => string | null,
 *   setParam: (key: string, value: string) => void,
 *   deleteParam: (key: string) => void,
 *   getAllParams: () => Record<string, string>,
 *   clearAllParams: () => void
 * }}
 */
export const useSearchParams = (): {
  searchParams: {
    searchParams: URLSearchParams;
    getParam: (key: string) => string | null;
    setParam: (key: string, value: string) => void;
    deleteParam: (key: string) => void;
    getAllParams: () => Record<string, string>;
    clearAllParams: () => void;
  };
  getParam: (key: string) => string | null;
  setParam: (key: string, value: string) => void;
  deleteParam: (key: string) => void;
  getAllParams: () => Record<string, string>;
  clearAllParams: () => void;
} => {
  
  const router = useRouter();
  const searchParams = useSearchParams()
  const pathname = usePathname()
  // Get current search params from URL

  /**
   * Get a specific parameter value
   * @param {string} key - The parameter key
   * @returns {string | null} - The parameter value or null if not found
   */
  const getParam = useCallback(
    (key: string) => searchParams.getParam(key),
    [searchParams]
  );

  /**
   * Set or update a parameter
   * @param {string} key - The parameter key
   * @param {string} value - The parameter value
   */
  const setParam = useCallback(
    (key: string, value: string) => {
      searchParams.setParam(key, value);
      router.push(`${pathname}?${searchParams.toString()}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Delete a parameter
   * @param {string} key - The parameter key to remove
   */
  const deleteParam = useCallback(
    (key: string) => {
      searchParams.deleteParam(key);
      router.push(`${pathname}?${searchParams.toString()}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Get all parameters as an object
   * @returns {Record<string, string>} - Object with all parameters
   */
  const getAllParams = useCallback(
    () => searchParams.getAllParams(),
    [searchParams]
  );

  /**
   * Clear all parameters from URL
   */
  const clearAllParams = useCallback(() => {
    router.push(pathname);
  }, [router, pathname]);

  return {
    searchParams,
    getParam,
    setParam,
    deleteParam,
    getAllParams,
    clearAllParams,
  };
};