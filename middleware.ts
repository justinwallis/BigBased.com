import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Handle Payload CMS admin routes
  if (pathname.startsWith("/cms-admin")) {
    // Rewrite to the API route that handles Payload
    const url = request.nextUrl.clone()
    url.pathname = `/api/payload${pathname.replace("/cms-admin", "")}`
    return NextResponse.rewrite(url)
  }

  // Continue with the existing middleware logic
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
