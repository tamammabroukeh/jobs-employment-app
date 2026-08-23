import NextAuth from "next-auth"
import { authOptions } from "@/auth"

// Initialize NextAuth handler
const handler = NextAuth(authOptions)

// Export GET and POST handlers for App Router
export { handler as GET, handler as POST }

// Add runtime configuration for Vercel
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
