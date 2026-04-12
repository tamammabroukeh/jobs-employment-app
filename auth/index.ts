import NextAuth from "next-auth";
import authConfig from "./auth.config";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";

const EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes in milliseconds

// Configure NextAuth
export const authClient = NextAuth({
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: { 
      token: JWT; 
      user?: User; 
      trigger?: "signIn" | "signUp" | "update"; 
      session?: Session;
    }) {
      console.log(Date.now(), token.exp ? (token.exp as number) * 1000 : undefined, "time", token, trigger, "trigger")
      if (trigger === "update" && session)
        return { ...session, ...token }
      // Initial sign in
      if (user) {
        console.log("user")
        token.sub = user.id?.toString();
        token.role = user?.role;
        token.accessToken = user?.accessToken;
        token.refreshToken = user?.refreshToken;
        token.tokenExpires = user?.tokenExpires;
        token.error = undefined;
      }
      // Add a 5-minute buffer to refresh before actual expiration
      if (token.exp && (Date.now() < ((token.exp as number) * 1000) - EXPIRY_BUFFER)) {
        console.log(Date.now(), token.exp ? (token.exp as number) * 1000 : undefined, "time")
        return token;
      }
      if (!token.role || !token.sub) {
        console.log(!token.role || !token.sub, "!token.role || !token.sub")
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
    async session({ session, token }: { session: Session; token: JWT }) {
      // Add custom properties to session
      if (token && session.user) {
        session.user.id = token.sub as string;
        session.user.role = token.role as "admin" | "owner" | "company" | "employee";
        session.accessToken = token.accessToken as string;

        // Optionally pass error to client
        if (token.error === "RefreshTokenError") {
          session.error = token.error as string;
        }
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 1 * 1 * 60 * 60, // 1 hour
  },
  jwt: {
    maxAge: 1 * 1 * 60 * 60, // 1 hour
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
});

export const { handlers, auth, signOut, unstable_update } = authClient;