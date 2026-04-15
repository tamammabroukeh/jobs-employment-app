import { ErrorMessages } from "@/constants/errors";

/**
 * Enhanced FetchError class for API request errors
 * Provides structured error information for better debugging and user feedback
 */
export class FetchError extends Error {
  info?: unknown;
  status?: number;
  type: "api" | "network" | "timeout" | "parse" | "unknown";

  constructor(message?: string, info?: unknown, status?: number) {
    // Determine appropriate error message based on status code
    const errorMessage = message || determineErrorMessage(status);

    super(errorMessage);
    this.name = "FetchError";
    this.info = info;
    this.status = status;
    this.type = determineErrorType(status);

    // Capture stack trace for better debugging
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, FetchError);
    }
  }

  /**
   * Returns a user-friendly error message that can be displayed in the UI
   */
  getUserMessage(): string {
    // For validation errors (422), try to extract specific validation messages
    if (this.status === 422 && this.info && typeof this.info === "object") {
      const validationInfo = this.info as Record<string, unknown>;
      if ("errors" in validationInfo && validationInfo.errors) {
        // Return the first validation error message if available
        const firstError = Object.values(validationInfo.errors)[0];
        if (Array.isArray(firstError) && firstError.length > 0) {
          return firstError[0] as string;
        }
      }
    }

    // Return appropriate message based on error type
    switch (this.type) {
      case "timeout":
        return "Request timed out. Please check your connection and try again.";
      case "network":
        return "Network error. Please check your connection and try again.";
      case "api":
        if (this.status === 401)
          return "Authentication required. Please log in.";
        if (this.status === 403)
          return "You do not have permission to perform this action.";
        if (this.status === 404) return "The requested resource was not found.";
        if (this.status && this.status >= 500)
          return "Server error. Please try again later.";
        return this.message;
      default:
        return this.message;
    }
  }
}

/**
 * Determine the appropriate error message based on status code
 */
function determineErrorMessage(status?: number): string {
  if (!status) return ErrorMessages.Default;

  if (status >= 500) return ErrorMessages.ServerError;
  if (status === 401) return "Authentication required";
  if (status === 403) return "Permission denied";
  if (status === 404) return "Resource not found";
  if (status === 408) return "Request timeout";
  if (status === 422) return "Validation error";

  return ErrorMessages.Default;
}

/**
 * Determine the error type based on status code
 */
function determineErrorType(
  status?: number,
): "api" | "network" | "timeout" | "parse" | "unknown" {
  if (!status) return "unknown";

  if (status === 408) return "timeout";
  if (status === 0 || status === 499) return "network"; // 0 = network error, 499 = client closed request
  if (status >= 400) return "api";

  return "unknown";
}

/**
 * Error class for server actions
 */
export class ActionError extends Error {
  // code?: string;
  // details?: Record<string, any>;
  // constructor(message: string, code?: string, details?: Record<string, any>) {
  //   super(message);
  //   this.name = 'ActionError';
  //   this.code = code;
  //   this.details = details;
  //   // Capture stack trace for better debugging
  //   if (Error.captureStackTrace) {
  //     Error.captureStackTrace(this, ActionError);
  //   }
  // }
}
