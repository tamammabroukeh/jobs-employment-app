"use server";
import apiFetcher from "./api.instance";
import { RequestInit } from "next/dist/server/web/spec-extension/request";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function authFetcher<T>(
  path: string,
  requestInit?: RequestInit,
): Promise<T> {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;
  const isAuthorized = !!token;
  
  console.log("authFetcher", path);
  console.log("Has session?", !!session);
  console.log("Has token?", !!token);
  
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
