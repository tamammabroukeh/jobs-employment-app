import NextAuth, { type NextAuthOptions } from "next-auth";
import { authOptions as libAuthOptions } from "@/lib/auth";

// Export the unified auth configuration with proper typing
export const authOptions: NextAuthOptions = {
  ...libAuthOptions,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 1 * 60 * 60, // 1 hour
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax' as const,
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