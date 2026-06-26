import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import apiFetcher from "@/apis/api.instance"
import { IAuth, IRefreshToken } from "@/apis/services/auth/interface"
import { Methods } from "@/constants/methods"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "owner" | "employer" | "employee"
  accessToken: string
  refreshToken: string
  tokenExpires: number
}

/**
 * Refresh access token for NextAuth JWT callback
 * This is called automatically before token expires (proactive refresh)
 * 
 * Note: This is different from the 401 error refresh in tokenManager.ts
 * - This runs BEFORE token expires (time-based)
 * - tokenManager runs AFTER 401 error (error-based)
 */
async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("[Auth JWT] Attempting to refresh access token")

    // Use apiFetcher with authorization header
    const data = await apiFetcher<IRefreshToken>(`/auth/refresh`, {
      method: Methods.POST,
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
    });

    console.log("[Auth JWT] Token refresh successful")
    console.log("[Auth JWT] New token expires in:", data.expires_in, "seconds")

    return {
      ...token,
      accessToken: data.access_token,
      refreshToken: data.refresh_token ?? token.refreshToken,
      tokenExpires: Date.now() + (data.expires_in ?? 3600) * 1000,
      // Update user data if provided
      name: data.user?.name ?? token.name,
      email: data.user?.email ?? token.email,
      role: data.user?.roles ? mapRole(data.user.roles) : token.role,
      error: undefined,
    }
  } catch (error) {
    console.error("[Auth JWT] Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

// Map role string to NextAuth role type
const mapRole = (roles: string[] | undefined): "admin" | "owner" | "employer" | "employee" => {
  if (!roles || roles.length === 0) return "employee";
  
  const role = roles[0].toLowerCase();
  
  switch (role) {
    case "admin":
      return "admin";
    case "owner":
      return "owner";
    case "employer":
    case "company": // Support both "employer" and "company" from API
      return "employer";
    case "employee":
      return "employee";
    default:
      return "employee";
  }
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          const response = await apiFetcher<IAuth>(`/auth/login`, {
            method: Methods.POST,
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })
          
          console.log("[Auth] Login response:", response);
          
          // Handle API response errors
          if (!response.user || !response.access_token) {
            console.error("[Auth] API Error:", response.message);
            return null;
          }

          return {
            id: response.user.id,
            email: response.user.email,
            name: response.user.name,
            role: mapRole(response.user.roles),
            accessToken: response.access_token,
            refreshToken: "", // Add if your API provides refresh token
            tokenExpires: Date.now() + (response.expires_in || 3600) * 1000,
          }
        } catch (error) {
          console.error("[Auth] Authorization error:", error);
          if (error instanceof Error) {
            console.error("[Auth] NextAuth Error:", error.name, error.message);
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger }) {
      if (user) {
        console.log("[Auth] Initial sign in, setting up tokens")
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          tokenExpires: user.tokenExpires,
          role: user.role,
          id: user.id,
        }
      }

      if (trigger === "update") {
        console.log("[Auth] Session update triggered")
        return token
      }

      const bufferTime = 5 * 60 * 1000 // 5 minutes in milliseconds
      const tokenExpiresWithBuffer = (token.tokenExpires as number) - bufferTime

      if (Date.now() < tokenExpiresWithBuffer) {
        return token
      }

      console.log("[Auth] Token expired or expiring soon, refreshing...")
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      if (token.error) {
        console.log("[Auth] Session has error:", token.error)
        return {
          ...session,
          error: token.error as string,
        }
      }

      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
          role: token.role as "admin" | "owner" | "employer" | "employee",
        },
        accessToken: token.accessToken as string,
        error: undefined,
      }
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      console.log("[Auth] User signed in:", user.email)
    },
    async signOut() {
      console.log("[Auth] User signed out")
    },
  },
}
