import apiFetcher from "@/api/api.instance";
import CredentialsProvider from "next-auth/providers/credentials";
import { IAuth } from "@/api/services/auth/interface";
import { Methods } from "@/constants/methods";
import { NextAuthOptions } from "next-auth";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
        mode: {},
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const response = await apiFetcher<IAuth>(`/auth/login`, {
            method: Methods.POST,
            body: JSON.stringify({ 
              email: credentials.email, 
              password: credentials.password 
            }),
          });

          console.log(response);
          const { data, message, access_token, expires_in } = response;
          // Handle API response errors
          if (!data && !access_token) {
            console.error("API Error:", message);
            return null;
          }

          // Return user data for session
          return {
            id: data?.id,
            first_name: data?.first_name,
            last_name: data?.last_name,
            email: data?.email,
            role: data?.role,
            accessToken: access_token as string,
          };
        } catch (error) {
          console.error(
            "Authorization error:",
            error,
            error instanceof Error,
          );
          // Enhanced error handling
          if (error instanceof Error) {
            console.error("NextAuth Error:", error.name, error.message);
          } else if (error instanceof Error) {
            console.error("Authorization error:", error.message);
          } else {
            console.error("Unknown authorization error:", error);
          }
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthOptions;
