import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Check if the request is for a debug page
  if (request.nextUrl.pathname === "/debug" || request.nextUrl.pathname.startsWith("/debug/")) {
    // The debug pages are now in the (debug) route group
    // but we want to keep the same URL structure for users
    // So we don't need to redirect, Next.js will handle this automatically

    // We can add special headers for debug pages if needed
    const headers = new Headers(request.headers)
    headers.set("x-debug-mode", "true")

    return NextResponse.next({
      request: {
        headers,
      },
    })
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/debug", "/debug/:path*"],
}
