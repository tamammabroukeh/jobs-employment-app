"use server";
import apiFetcher from "./api.instance";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { refreshAccessToken } from "./utils/tokenManager";
import { is401Error } from "./utils/errorHelpers";
import { FetchError } from "./types/error";

/**
 * Authenticated API fetcher with automatic token refresh
 * Automatically refreshes token on 401 errors and retries the request
 *
 * @param path - API endpoint path
 * @param requestInit - Fetch request options
 * @param isRetry - Internal flag to prevent infinite retry loops
 * @returns Promise with the response data
 */
export async function authFetcher<T>(
  path: string,
  requestInit?: RequestInit,
  isRetry: boolean = false,
): Promise<T> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const isAuthorized = !!token;

  console.log("[Auth Fetcher]", path);
  console.log("[Auth Fetcher] Has session?", !!session);
  console.log("[Auth Fetcher] Has token?", !!token);
  console.log("[Auth Fetcher] Is retry?", isRetry);

  // if (!isAuthorized) {
  //   throw new Error("Unauthorized: No valid session token found");
  // }

  // Add authorization header with the token
  const authHeaders: HeadersInit = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(requestInit?.headers || {}),
  };

  try {
    // Call the base fetcher with auth headers
    return await apiFetcher<T>(path, {
      ...requestInit,
      headers: authHeaders,
      // Preserve cache settings from requestInit, don't override them
      // This allows revalidation tags to work properly
    });
  } catch (error) {
    // Check if it's a 401 error and we haven't already retried
    if (is401Error(error) && !isRetry) {
      console.log("[Auth Fetcher] Received 401, attempting token refresh...");

      // Try to refresh the token
      const newTokenData = await refreshAccessToken();

      if (newTokenData?.access_token) {
        console.log(
          "[Auth Fetcher] Token refreshed successfully, retrying request...",
        );

        // Update the authorization header with the new token
        const newAuthHeaders: HeadersInit = {
          Authorization: `Bearer ${newTokenData.access_token}`,
          ...(requestInit?.headers || {}),
        };

        // Retry the request with the new token
        return await apiFetcher<T>(path, {
          ...requestInit,
          headers: newAuthHeaders,
        });
      } else {
        console.error(
          "[Auth Fetcher] Token refresh failed, throwing 401 error",
        );
        throw new FetchError(
          "Session expired. Please login again.",
          "Token refresh failed",
          401,
        );
      }
    }

    // If not a 401 or already retried, throw the original error
    throw error;
  }
}
