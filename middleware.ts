import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect /profile/security to /profile?tab=security
  if (pathname === "/profile/security") {
    return NextResponse.redirect(new URL("/profile?tab=security", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/profile/security"],
}
