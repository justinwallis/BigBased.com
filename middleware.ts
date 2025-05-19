import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Simplified middleware that only checks a few protected routes
export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

  // Only apply middleware to specific protected paths
  if (path.startsWith("/profile")) {
    // For now, just redirect to home page
    // We'll implement proper auth checks after fixing the basic NextAuth setup
    return NextResponse.redirect(new URL("/", request.url))
  }

  // Allow all other requests to proceed
  return NextResponse.next()
}

// Only run middleware on specific paths
export const config = {
  matcher: ["/profile/:path*"],
}
