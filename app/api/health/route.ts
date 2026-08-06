import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: {
      hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
      hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
      nextAuthUrl: process.env.NEXTAUTH_URL,
      hasBaseUrl: !!process.env.BASE_URL,
      nodeEnv: process.env.NODE_ENV,
    },
  });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
