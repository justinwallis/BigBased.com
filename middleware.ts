import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { parseDomain, isEnhancedDomainsEnabled } from "./lib/domain-utils"
import { shouldTrackVisit } from "./utils/bot-detection"

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
    // Get request info for bot detection
    const userAgent = request.headers.get("user-agent")
    const referrer = request.headers.get("referer")
    const ip = request.ip || request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip")

    // Only track visits from real users, not bots
    if (shouldTrackVisit(userAgent, referrer, ip)) {
      // Track domain visit (non-blocking) - but only for real users
      fetch(`${request.nextUrl.origin}/api/analytics/track-visit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": userAgent || "unknown",
        },
        body: JSON.stringify({
          domain,
          userAgent,
          referrer,
          ip: ip?.split(",")[0]?.trim(), // Get first IP if multiple
        }),
      }).catch(() => {
        // Silently fail - analytics shouldn't break the app
      })
    }

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
