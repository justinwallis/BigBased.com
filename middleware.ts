import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // For now, just pass through all requests
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Add protected routes here when ready
    // '/profile/:path*',
    // '/admin/:path*',
  ],
}
