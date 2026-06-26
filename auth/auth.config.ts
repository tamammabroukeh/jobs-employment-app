import apiFetcher from "@/apis/api.instance";
import CredentialsProvider from "next-auth/providers/credentials";
import { IAuth } from "@/apis/services/auth/interface";
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
            console.error("[Auth Config] Missing credentials");
            return null;
          }

          console.log("[Auth Config] ========== LOGIN ATTEMPT ==========");
          console.log("[Auth Config] Email:", credentials.email);
          console.log("[Auth Config] Password length:", credentials.password?.length);
          console.log("[Auth Config] Calling API:", `${process.env.BASE_URL}/auth/login`);

          const response = await apiFetcher<IAuth>(`/auth/login`, {
            method: Methods.POST,
            body: JSON.stringify({ 
              email: credentials.email, 
              password: credentials.password 
            }),
          });

          console.log("[Auth Config] ========== API RESPONSE ==========");
          console.log("[Auth Config] Response type:", typeof response);
          console.log("[Auth Config] Response keys:", Object.keys(response || {}));
          console.log("[Auth Config] Full response:", JSON.stringify(response, null, 2));
          
          // Handle API response errors - new API structure
          if (!response) {
            console.error("[Auth Config] Response is null or undefined");
            return null;
          }

          if (!response.user) {
            console.error("[Auth Config] Missing user in response");
            console.error("[Auth Config] Response.user:", response.user);
            return null;
          }

          if (!response.access_token) {
            console.error("[Auth Config] Missing access_token in response");
            console.error("[Auth Config] Response.access_token:", response.access_token);
            return null;
          }

          console.log("[Auth Config] ========== CREATING USER OBJECT ==========");
          console.log("[Auth Config] User ID:", response.user.id);
          console.log("[Auth Config] User name:", response.user.name);
          console.log("[Auth Config] User email:", response.user.email);
          console.log("[Auth Config] User roles:", response.user.roles);

          // Map role from roles array to NextAuth role type
          const mapRole = (roles: string[] | undefined): "admin" | "owner" | "employer" | "employee" => {
            if (!roles || roles.length === 0) {
              console.log("[Auth Config] No roles found, defaulting to employee");
              return "employee";
            }
            
            const role = roles[0].toLowerCase();
            console.log("[Auth Config] Mapping role:", role);
            
            switch (role) {
              case "admin":
                return "admin";
              case "owner":
                return "owner";
              case "employer":
              case "company":
                return "employer";
              case "employee":
                return "employee";
              default:
                console.log("[Auth Config] Unknown role, defaulting to employee");
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

          console.log("[Auth Config] ========== USER OBJECT CREATED ==========");
          console.log("[Auth Config] User:", { ...user, accessToken: "***HIDDEN***" });
          console.log("[Auth Config] Returning user to NextAuth");
          return user;
        } catch (error) {
          // Enhanced error handling
          console.error("[Auth Config] ========== EXCEPTION IN AUTHORIZE ==========");
          if (error instanceof Error) {
            console.error("[Auth Config] Error name:", error.name);
            console.error("[Auth Config] Error message:", error.message);
            console.error("[Auth Config] Error stack:", error.stack);
          } else {
            console.error("[Auth Config] Unknown error type:", typeof error);
            console.error("[Auth Config] Error value:", JSON.stringify(error, null, 2));
          }
          console.error("[Auth Config] ========== RETURNING NULL ==========");
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthOptions;
