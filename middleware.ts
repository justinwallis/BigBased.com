import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Clone the request headers
  const requestHeaders = new Headers(request.headers)

  // Add the full URL as a custom header
  requestHeaders.set("x-url", request.url)

  // Check if the request is for a debug page
  if (request.nextUrl.pathname === "/debug" || request.nextUrl.pathname.startsWith("/debug/")) {
    // The debug pages are now in the (debug) route group
    // but we want to keep the same URL structure for users
    // So we don't need to redirect, Next.js will handle this automatically

    // We can add special headers for debug pages if needed
    const headers = new Headers(requestHeaders)
    headers.set("x-debug-mode", "true")

    return NextResponse.next({
      request: {
        headers,
      },
    })
  }

  // Return the response with the modified headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/debug",
    "/debug/:path*",
  ],
}
