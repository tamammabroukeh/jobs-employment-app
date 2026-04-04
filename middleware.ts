import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  // Simply pass through - locale is handled by cookies in i18n/request.ts
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
