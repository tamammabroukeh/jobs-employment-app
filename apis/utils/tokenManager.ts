"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IRefreshToken } from "@/apis/services/auth/interface";
import { Methods } from "@/constants/methods";
import apiFetcher from "@/apis/api.instance";

/**
 * Token Manager Utility (Server-Side)
 * Handles token refresh logic for API requests
 */

let isRefreshing = false;
let refreshPromise: Promise<IRefreshToken | null> | null = null;

/**
 * Refresh the access token using the refresh endpoint
 * This function is called when a 401 error is received
 * 
 * @returns Promise with new token data or null if refresh fails
 */
export async function refreshAccessToken(): Promise<IRefreshToken | null> {
  // If already refreshing, return the existing promise
  if (isRefreshing && refreshPromise) {
    console.log("[Token Manager] Token refresh already in progress, waiting...");
    return refreshPromise;
  }

  isRefreshing = true;
  
  refreshPromise = (async () => {
    try {
      console.log("[Token Manager] Starting token refresh...");
      
      // Get current session to get the access token
      const session = await getServerSession(authOptions);
      
      if (!session?.accessToken) {
        console.error("[Token Manager] No access token found in session");
        return null;
      }

      console.log("[Token Manager] Calling refresh endpoint: /auth/refresh");
      
      // Use apiFetcher with authorization header
      const data = await apiFetcher<IRefreshToken>(`/auth/refresh`, {
        method: Methods.POST,
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      
      console.log("[Token Manager] Token refresh successful");
      console.log("[Token Manager] New token expires in:", data.expires_in, "seconds");
      
      return data;
    } catch (error) {
      console.error("[Token Manager] Error refreshing token:", error);
      return null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}
