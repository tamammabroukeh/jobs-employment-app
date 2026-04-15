"use server";
import { FetchError } from "./types/error";
import { normalizeUrl } from "../utils/normalizeUrl";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { ErrorMessages } from "@/constants/errors";

// Configuration
const baseUrl = process.env.BASE_URL;
const DEFAULT_REVALIDATION_TIME = 3600 * 3; // 3 hours
const API_TIMEOUT = Number(process.env.NEXT_PUBLIC_API_TIMEOUT || 30000);

/**
 * Enhanced API fetcher with error handling and locale support
 * @param path - API endpoint path
 * @param requestInit - Fetch request options
 * @returns Promise with the response data
 */
// interface RequestOptions extends RequestInit {
//   timeout?: number;
// }
export default async function apiFetcher<T>(
  path: string,
  requestInit?: RequestInit,
): Promise<T> {
  const url = normalizeUrl(baseUrl, path);
  const timeout = API_TIMEOUT;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  // Merge default options with provided options
  const init: RequestInit = {
    cache: "no-cache",
    method: requestInit?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...requestInit?.headers,
    } as HeadersInit,
    next: {

      revalidate: DEFAULT_REVALIDATION_TIME,
      ...requestInit?.next,

    },
    signal: controller.signal,
    ...requestInit,
  };
  console.log(`Fetching: ${url}`); //${JSON.stringify(init)}
  try {
    const response = await fetch(url, init);
    console.log(
      `Fetch Response status:${response.status} statusText:${response.statusText} Ok:${response.ok}`,
    );
    console.log(url, JSON.stringify(response.url), JSON.stringify(response.body)); //JSON.stringify(response.body)
    // console.log(url,response);
    // Clean up timeout regardless of outcome
    clearTimeout(timeoutId);

    // Handle response based on status and content type
    return await handleResponse<T>(response);
  } catch (error) {
    clearTimeout(timeoutId);
    return handleFetchError(error, timeout);
  }
}
// if (
//   !contentType ||
//   !contentType.includes("application/json") ||
//   !response.ok
// ) {
//   errorInfo =
//     !contentType || !contentType.includes("application/json")
//       ? `Failed to read response body (${response.status} ${response.statusText})`
//       : await response.json();
//   throw new FetchError(undefined, errorInfo, response.status);
// }
/**
 * Handle API response based on status code and content type
 */
async function handleResponse<T>(response: Response): Promise<T> {
  const contentType = response.headers.get("content-type");
  const isJsonResponse =
    contentType && contentType.includes("application/json");
  console.log("isJsonResponse", isJsonResponse);
  // Handle successful responses
  if (response.ok) {
    // Handle no-content responses
    if (response.status === 204) {
      return true as T;
    }

    // Parse and return JSON response
    if (isJsonResponse) {
      return await response.json();
    }
  }

  // Handle error responses
  let errorInfo: unknown;

  try {
    // Try to parse error response as JSON
    errorInfo = isJsonResponse
      ? await response.json()
      : `Failed to read response body (${response.status} ${response.statusText})`;
  } catch (parseError) {
    errorInfo = `Error parsing response: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
  }

  throw new FetchError(undefined, errorInfo, response.status);
}

/**
 * Handle fetch errors and categorize them appropriately
 */
function handleFetchError(error: unknown, timeout: number): never {
  // Handle abort errors specifically
  if (error instanceof DOMException && error.name === "AbortError") {
    console.error("Request timed out after", timeout, "ms");
    throw new FetchError(
      "Request timed out. Please try again later.",
      null,
      408,
    );
  }

  // Preserve FetchError instances
  if (error instanceof FetchError) {
    console.error(`API Error (${error.status}):`, error.message);
    throw error;
  }

  // Log and wrap other errors
  console.error("Fetch Error:", error);
  throw new FetchError(
    ErrorMessages.Default,
    error instanceof Error ? error.message : error,
  );
}
