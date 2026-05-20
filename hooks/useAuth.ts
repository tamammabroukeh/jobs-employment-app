"use client"
import { useSession } from "next-auth/react"

export function useAuth() {
  const { data: session, status } = useSession()
  
  return {
    // Token
    token: session?.accessToken,
    
    // User data
    user: session?.user,
    userId: session?.user?.id,
    userEmail: session?.user?.email,
    userName: session?.user?.name,
    userRole: session?.user?.role,
    
    // Status
    isAuthenticated: status === "authenticated" && !!session?.accessToken,
    isLoading: status === "loading",
    isUnauthenticated: status === "unauthenticated",
    
    // Session
    session,
  }
}
