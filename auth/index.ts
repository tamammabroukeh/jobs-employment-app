import NextAuth, { NextAuthConfig } from "next-auth";
import authConfig from "./auth.config";
const EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

// Configure NextAuth
export const authClient = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    authorized: ({ auth, request: { nextUrl } }) => {
      console.log("nextUrl.pathname", nextUrl.pathname);
      const privatePages = ["/favorite", "/my-orders", "/my-profile"];
      // /^(\/(\/en|ar))?(\/(favorite|my-orders|my-profile))\/?$/i


      const isLoggedIn = !!auth?.user;

      // if (isPrivatePages) {
      //   if (isLoggedIn) return !!auth;
      //   return false;
      // }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      console.log(Date.now(), token.exp ? token.exp * 1000 : undefined, "time", token, trigger, "trigger")
      if (trigger === "update")
        return { ...session, ...token }
      // Initial sign in
      if (user) {
        console.log("user")
        token.sub = user.id?.toString();
        token.role = user?.role;
        token.accessToken = user?.accessToken;
        token.first_name = user?.first_name;
        token.last_name = user?.last_name;
        token.email = user?.email;
        token.error = undefined;
      }
      // Add a 5-minute buffer to refresh before actual expiration
      if (token.exp && (Date.now() < (token.exp * 1000) - EXPIRY_BUFFER)) {
        console.log(Date.now(), token.exp ? token.exp * 1000 : undefined, "time")
        return token;
      }
      if (!token.user_type || !token.id) {
        console.log(!token.user_type || !token.id, "!token.user_type || !token.id")
        return token;
      }
      else {
        // Handle token refresh
        try {
          // Only refresh if we're past the refresh token expiry or don't have one set
          // const { data } = token.user_type === UserType.SELLER
          //   ? await authRepository.sellerRefreshToken()
          //   : await authRepository.customerRefreshToken();

          // if (data && data.access_token) {
          //   // Update token with new access token
          //   token.accessToken = data.access_token;
          // token.exp =
          // Reset refresh token expiry (50 minutes from now)
          // token.refreshTokenExpiry =  Math.round(Date.now() / 1000) + 50 * 60;
          // } else {
          //   // If we didn't get a token back, mark as error
          //   token.error = "RefreshTokenError";
          // }
          return token;
        } catch (error) {
          // Log error in development only
          if (process.env.NODE_ENV !== "production") {
            console.error("Failed to refresh access token:", error);
          }
          // Mark token with error but don't invalidate the session yet
          // This allows for retry on next request
          return {
            ...token,
            error: "RefreshTokenError"
          };
        }
      }
    },
    async session({ session, token }) {
      // Add custom properties to session
      if (token && session.user) {
        session.user.first_name = token?.first_name as string;
        session.user.last_name = token?.last_name as string;
        session.user.role = token?.role as string;
        session.accessToken = token?.accessToken as string;

        // Optionally pass error to client
        if (token.error === "RefreshTokenError") {
          session.error = token.error;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 1 * 60 * 60, // 1 days
  },
  jwt: {
    maxAge: 1 * 1 * 60 * 60, // 30 * 24 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  ...authConfig,
} satisfies NextAuthConfig);

export const { handlers, auth, signOut, unstable_update } = authClient;