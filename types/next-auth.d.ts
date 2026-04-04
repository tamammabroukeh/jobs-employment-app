// import { IUser } from "@workspace/shared/api/services/users/interface";
// import "next-auth";
// declare module "next-auth" {
//   interface User {
//     id: IUser["id"];
//     first_name?: IUser["first_name"];
//     last_name?: IUser["last_name"];
//     email?: IUser["email"];
//     role?: IUser["role"];
//     phone_number?: IUser["phone_number"];
//     accessToken: string;
//   }
//   interface Session {
//     user: {
//       id: IUser["id"];
//       first_name?: IUser["first_name"];
//       last_name?: IUser["last_name"];
//       email?: IUser["email"];
//       role?: IUser["role"];
//       phone_number?: IUser["phone_number"];

//     };
//     accessToken: string;
//     error?: "RefreshTokenError"
//   }
// }

// declare module "next-auth/jwt" {
//   /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
//   interface JWT {
//     id: IUser["id"];
//     first_name?: IUser["first_name"];
//     last_name?: IUser["last_name"];
//     email?: IUser["email"];
//     role?: IUser["role"];
//     phone_number?: IUser["phone_number"];
//     accessToken: string;
//     error?: "RefreshTokenError"
//   }

// }



import type { DefaultSession, DefaultUser } from "next-auth"
import type { DefaultJWT } from "next-auth/jwt"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: "admin" | "owner" | "company" | "employee"
    } & DefaultSession["user"]
    accessToken?: string
    error?: string
  }

  interface User extends DefaultUser {
    role: "admin" | "owner" | "company" | "employee"
    accessToken: string
    refreshToken: string
    tokenExpires: number
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string
    refreshToken?: string
    tokenExpires?: number
    role?: "admin" | "owner" | "company" | "employee"
    error?: string
  }
}
