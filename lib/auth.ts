// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { jwtDecode } from "jwt-decode";
// import apiFetcher from "@/apis/api.instance";
// import { IAuth,IRefreshToken } from "@/apis/services/auth/interface";
// import { Token } from "@/types/auth-types";
// import { Methods } from "@/constants/methods";

// export const authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         try {
//           const response = await apiFetcher<IAuth>(`/auth/login`, {
//             method: Methods.POST,
//             body: JSON.stringify({
//                 credentials
//             //   email: "ian69@example.org",
//             //   password: "password",
//             }),
//           });

//           console.log(response);
//           const { data, message, access_token, expires_in } = response;
//           // Handle API response errors
//           if (!data && !access_token) {
//             console.error("API Error:", message);
//             return null;
//           }

//           // Return user data for session
//           return {
//             id: data?.id,
//             first_name: data?.first_name,
//             last_name: data?.last_name,
//             email: data?.email,
//             role: data?.role,
//             accessToken: access_token as string,
//           };
//         } catch (error) {
//           console.error("Authorization error:", error, error instanceof Error);
//           // Enhanced error handling
//           if (error instanceof Error) {
//             console.error("NextAuth Error:", error.name, error.message);
//           } else if (error instanceof Error) {
//             console.error("Authorization error:", error.message);
//           } else {
//             console.error("Unknown authorization error:", error);
//           }
//           return null;
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user, account }) {
//       // Initial sign in
//       if (user && account) {
//         return {
//           ...token,
//           ...user,
//         };
//       }

//       // Return previous token if the access token has not expired yet
//       if (Date.now() < (token as Token).accessTokenExpires - 300000) {
//         return token;
//       }

//       // Access token has expired, try to update it
//       return await refreshAccessToken(token as Token);
//     },
//     async session({ session, token }) {
//       session.user = {
//         id: token.id as string,
//         email: token.email as string,
//         name: token.name as string,
//         role: token.role as string,
//         accessToken: token.accessToken as string,
//       };
//       session.error = token.error as string;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/auth/signin",
//     signUp: "/auth/signup",
//   },
//   session: {
//     strategy: "jwt",
//   },
// };

// async function refreshAccessToken(token: Token): Promise<Token> {
//   try {
//      const response = await apiFetcher<IRefreshToken>(`/auth/login`, {
//              headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token.refreshToken}`,
//       },
//           });
//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(data.message || "Failed to refresh token");
//     }

//     const decoded: { exp: number } = jwtDecode(data.access_token);

//     return {
//       ...token,
//       accessToken: data.access_token,
//       refreshToken: data.refresh_token,
//       accessTokenExpires: decoded.exp * 1000,
//     };
//   } catch (error) {
//     console.error("RefreshAccessToken error:", error);
//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     };
//   }
// }



import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import type { JWT } from "next-auth/jwt"
import apiFetcher from "@/apis/api.instance"
import { IAuth, IRefreshToken } from "@/apis/services/auth/interface"
import { authFetcher } from "@/apis/authInstace"
import { Methods } from "@/constants/methods"
import { UserRole } from "@/constants/roles"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "owner" | "company" | "employee"
  accessToken: string
  refreshToken: string
  tokenExpires: number
}

async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log("[Auth] Attempting to refresh access token")

    const response = await authFetcher<IRefreshToken>(`/auth/refresh`)

    console.log("[Auth] Token refresh successful")

    return {
      ...token,
      accessToken: response?.access_token,
      refreshToken: response.refresh_token ?? token.refreshToken,
      tokenExpires: Date.now() + (response.expires_in ?? 3600) * 1000,
      error: undefined,
    }
  } catch (error) {
    console.error("[Auth] Error refreshing access token:", error)
    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

// Map UserRole to NextAuth role type
const mapRole = (role: UserRole | undefined): "admin" | "owner" | "company" | "employee" => {
  switch (role) {
    case UserRole.ADMIN:
      return "admin";
    case UserRole.COMPANY:
      return "company";
    case UserRole.EMPLOYEE:
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
          
          const { data, message, access_token, expires_in } = response;
          
          // Handle API response errors
          if (!data || !access_token) {
            console.error("API Error:", message);
            return null;
          }

          return {
            id: String(data.id),
            email: data.email,
            name: `${data.first_name || ""} ${data.last_name || ""}`.trim() || data.email,
            role: mapRole(data.role),
            accessToken: access_token,
            refreshToken: "", // Add if your API provides refresh token
            tokenExpires: Date.now() + (expires_in || 3600) * 1000,
          }
        } catch (error) {
          console.error("Authorization error:", error);
          if (error instanceof Error) {
            console.error("NextAuth Error:", error.name, error.message);
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
          id: token.sub as string,
          role: token.role as "admin" | "owner" | "company" | "employee",
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
