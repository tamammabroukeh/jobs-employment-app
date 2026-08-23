import NextAuth from "next-auth";
import { authOptions as libAuthOptions } from "@/lib/auth";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

// Export the unified auth configuration
export const authOptions = {
  ...libAuthOptions,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 60 * 60, // 1 hour
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
};

// Configure NextAuth
export const authClient = NextAuth(authOptions);

export const { handlers, auth, signIn, signOut, unstable_update } = authClient;