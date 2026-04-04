"use server";
import apiFetcher from "./api.instance";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { getSession } from "next-auth/react";

export async function authFetcher<T>(
  path: string,
  requestInit?: RequestInit,
): Promise<T> {
   const session = await getSession();
  const token = session?.accessToken;
  const isAuthorized = !!token;
  console.log("authFetcher", path);
  if (!isAuthorized) {
    throw new Error("Unauthorized: No valid session token found");
  }
  // Add authorization header with the token
  const authHeaders: HeadersInit = {
    Authorization: `Bearer ${token}`,
    ...(requestInit?.headers || {}),
  };

  // Call the base fetcher with auth headers
  return apiFetcher<T>(path, {
    ...requestInit,
    headers: authHeaders,
    // For authenticated requests, typically want to bypass cache
    cache: "no-store",
    next: {
      ...requestInit?.next,
      revalidate: 0, // Don't cache authenticated requests
    },
  });
}
