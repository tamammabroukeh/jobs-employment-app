import apiFetcher from "@/apis/api.instance";
import CredentialsProvider from "next-auth/providers/credentials";
import { IAuth } from "@/apis/services/auth/interface";
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
            console.error("[Auth Config] Missing credentials");
            return null;
          }

          console.log("[Auth Config] Attempting login for:", credentials.email);

          const response = await apiFetcher<IAuth>(`/auth/login`, {
            method: Methods.POST,
            body: JSON.stringify({ 
              email: credentials.email, 
              password: credentials.password 
            }),
          });

          console.log("[Auth Config] Login response received");
          console.log("[Auth Config] Response keys:", Object.keys(response));
          console.log("[Auth Config] Has user?", !!response.user);
          console.log("[Auth Config] Has access_token?", !!response.access_token);
          console.log("[Auth Config] User data:", response.user);
          console.log("[Auth Config] Message:", response.message);
          
          // Handle API response errors - new API structure
          if (!response.user || !response.access_token) {
            console.error("[Auth Config] Missing user or access_token");
            console.error("[Auth Config] Full response:", JSON.stringify(response, null, 2));
            return null;
          }

          // Map role from roles array to NextAuth role type
          const mapRole = (roles: string[] | undefined): "admin" | "owner" | "company" | "employee" => {
            if (!roles || roles.length === 0) return "employee";
            
            const role = roles[0].toLowerCase();
            switch (role) {
              case "admin":
                return "admin";
              case "owner":
                return "owner";
              case "company":
                return "company";
              case "employee":
                return "employee";
              default:
                return "employee";
            }
          };

          // Return user data for session matching the User type
          const user = {
            id: String(response.user.id),
            name: response.user.name,
            email: response.user.email,
            role: mapRole(response.user.roles),
            accessToken: response.access_token,
            refreshToken: "", // Add refresh token if available from API
            tokenExpires: response.expires_in ? Date.now() + response.expires_in * 1000 : Date.now() + 3600000, // Default 1 hour
          };

          console.log("[Auth Config] Successfully created user object");
          console.log("[Auth Config] User ID:", user.id);
          console.log("[Auth Config] User role:", user.role);
          return user;
        } catch (error) {
          // Enhanced error handling
          console.error("[Auth Config] Exception caught in authorize:");
          if (error instanceof Error) {
            console.error("[Auth Config] Error name:", error.name);
            console.error("[Auth Config] Error message:", error.message);
            console.error("[Auth Config] Error stack:", error.stack);
          } else {
            console.error("[Auth Config] Unknown error type:", typeof error);
            console.error("[Auth Config] Error value:", error);
          }
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthOptions;
