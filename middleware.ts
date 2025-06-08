import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parseDomain, isEnhancedDomainsEnabled } from "./lib/domain-utils"

// Domains that should always be allowed
const ALWAYS_ALLOWED_DOMAINS = ["bigbased.com", "bigbased.us", "basedbook.com", "localhost", "vercel.app"]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hostname = request.headers.get("host") || ""
  const domain = parseDomain(hostname)

  // Skip middleware for static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next()
  }

  // Check if enhanced domains are enabled
  if (!isEnhancedDomainsEnabled()) {
    return NextResponse.next()
  }

  try {
    // Track domain visit (non-blocking)
    fetch(`${request.nextUrl.origin}/api/analytics/track-visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ domain }),
    }).catch(() => {
      // Silently fail - analytics shouldn't break the app
    })

    // Set domain context headers for server components
    const response = NextResponse.next()
    response.headers.set("x-domain", domain)
    response.headers.set("x-original-host", hostname)

    // Add domain-specific cookie for client-side awareness
    response.cookies.set("current-domain", domain, {
      path: "/",
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
    })

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    return NextResponse.next()
  }
}

// Configure middleware to run on specific paths
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /fonts (inside public)
     * 4. /examples (inside public)
     * 5. all root files inside public (e.g. /favicon.ico)
     */
    "/((?!api|_next|fonts|examples|[\\w-]+\\.\\w+).*)",
  ],
}
