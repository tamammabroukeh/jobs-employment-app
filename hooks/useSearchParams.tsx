'use client';

import { useCallback } from 'react';
import { usePathname, useRouter, useSearchParams as useNextSearchParams } from "next/navigation";

/**
 * Custom hook for managing URL search parameters
 * @returns {{
 *   searchParams: URLSearchParams,
 *   getParam: (key: string) => string | null,
 *   setParam: (key: string, value: string) => void,
 *   deleteParam: (key: string) => void,
 *   getAllParams: () => Record<string, string>,
 *   clearAllParams: () => void
 * }}
 */
export const useSearchParams = () => {
  const router = useRouter();
  const searchParams = useNextSearchParams();
  const pathname = usePathname();

  /**
   * Get a specific parameter value
   * @param {string} key - The parameter key
   * @returns {string | null} - The parameter value or null if not found
   */
  const getParam = useCallback(
    (key: string): string | null => {
      return searchParams.get(key);
    },
    [searchParams]
  );

  /**
   * Set or update a parameter
   * @param {string} key - The parameter key
   * @param {string} value - The parameter value
   */
  const setParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Delete a parameter
   * @param {string} key - The parameter key to remove
   */
  const deleteParam = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, router, pathname]
  );

  /**
   * Get all parameters as an object
   * @returns {Record<string, string>} - Object with all parameters
   */
  const getAllParams = useCallback((): Record<string, string> => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    return params;
  }, [searchParams]);

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