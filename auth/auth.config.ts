import apiFetcher from "@/api/api.instance";
import CredentialsProvider from "next-auth/providers/credentials";
import { IAuth } from "@/api/services/auth/interface";
import { Methods } from "@/constants/methods";
import { NextAuthOptions } from "next-auth";
import { UserRole } from "@/constants/roles";

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

          // Return user data for session matching the User type
          return {
            id: String(data?.id || ""),
            name: `${data?.first_name || ""} ${data?.last_name || ""}`.trim(),
            email: data?.email || "",
            role: mapRole(data?.role),
            accessToken: access_token as string,
            refreshToken: "", // Add refresh token if available from API
            tokenExpires: expires_in ? Date.now() + expires_in * 1000 : Date.now() + 3600000, // Default 1 hour
          };
        } catch (error) {
          // Enhanced error handling
          if (error instanceof Error) {
            console.error("Authorization error:", error.name, error.message);
          } else {
            console.error("Unknown authorization error:", error);
          }
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthOptions;
