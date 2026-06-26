/**
 * Error Helper Utilities
 * Shared utilities for error handling (works on both client and server)
 */

/**
 * Check if an error is a 401 Unauthorized error
 * @param error - The error to check
 * @returns true if the error is a 401 error
 */
export function is401Error(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status === 401;
  }
  return false;
}

/**
 * Check if an error is a 403 Forbidden error
 * @param error - The error to check
 * @returns true if the error is a 403 error
 */
export function is403Error(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status === 403;
  }
  return false;
}

/**
 * Check if an error is a 404 Not Found error
 * @param error - The error to check
 * @returns true if the error is a 404 error
 */
export function is404Error(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status === 404;
  }
  return false;
}

/**
 * Check if an error is a 500 Internal Server Error
 * @param error - The error to check
 * @returns true if the error is a 500 error
 */
export function is500Error(error: unknown): boolean {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status === 500;
  }
  return false;
}

/**
 * Get the status code from an error
 * @param error - The error to extract status from
 * @returns The status code or undefined
 */
export function getErrorStatus(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'status' in error) {
    return (error as { status: number }).status;
  }
  return undefined;
}

/**
 * Get the error message from an error
 * @param error - The error to extract message from
 * @returns The error message or a default message
 */
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return (error as { message: string }).message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Check if an error is a network error
 * @param error - The error to check
 * @returns true if the error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch failed')) {
    return true;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message.toLowerCase();
    return message.includes('network') || message.includes('fetch failed');
  }
  return false;
}

/**
 * Check if an error is a timeout error
 * @param error - The error to check
 * @returns true if the error is a timeout error
 */
export function isTimeoutError(error: unknown): boolean {
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }
  const status = getErrorStatus(error);
  return status === 408;
}
