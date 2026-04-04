import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth";

export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

export async function requireAuth(role?: string) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    throw new Error("Authentication required");
  }
  
  if (role && session.user.role !== role) {
    throw new Error(`Access denied. ${role} role required.`);
  }
  
  return session;
}