import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getDomainConfig } from "@/lib/domain-config"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const hostname = request.headers.get("host") || ""

  // Skip middleware for static assets
  const shouldSkipMiddleware =
    path.startsWith("/_next/") ||
    path.startsWith("/static/") ||
    path.startsWith("/public/") ||
    path.includes(".") ||
    path.startsWith("/api/auth") ||
    path.startsWith("/api/debug") ||
    path === "/api/notifications/send" ||
    path.startsWith("/debug-static") ||
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    path === "/manifest.json" ||
    path === "/browserconfig.xml" ||
    path === "/site.webmanifest"

  if (shouldSkipMiddleware) {
    return NextResponse.next()
  }

  try {
    // Get domain configuration
    const domainConfig = await getDomainConfig(hostname)

    // If domain is not active, redirect to main site
    if (!domainConfig.isActive) {
      return NextResponse.redirect(new URL("https://bigbased.com", request.url))
    }

    // Add domain info to headers for the app to use
    const response = NextResponse.next()
    response.headers.set("X-Domain-Type", domainConfig.siteType)
    response.headers.set("X-Domain-Name", domainConfig.domain)
    response.headers.set("X-Domain-ID", domainConfig.id.toString())

    // Track analytics (only for non-bot requests)
    const userAgent = request.headers.get("user-agent") || ""
    const isBot = /bot|crawler|spider|crawling/i.test(userAgent)
    if (!isBot && domainConfig.id > 0) {
      // We don't await this to avoid slowing down the response
      import("@/lib/domain-config").then(({ trackDomainVisit }) => {
        trackDomainVisit(domainConfig.id)
      })
    }

    // Site-specific page access control
    const siteType = domainConfig.siteType

    // BigBased exclusive pages
    const bigBasedPages = ["/books", "/voting", "/revolution", "/transform", "/features", "/partners"]
    // BasedBook exclusive pages
    const basedBookPages = ["/library", "/authors", "/collections"]

    if (siteType === "basedbook" && bigBasedPages.some((page) => path.startsWith(page))) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    if (siteType === "bigbased" && basedBookPages.some((page) => path.startsWith(page))) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Custom domains default to BigBased functionality
    if (siteType === "custom" && basedBookPages.some((page) => path.startsWith(page))) {
      return NextResponse.redirect(new URL("/", request.url))
    }

    // Auth check for protected paths
    const isProtectedPath = path.startsWith("/profile") || path.startsWith("/dashboard") || path.startsWith("/admin")

    if (isProtectedPath) {
      const supabaseSession = request.cookies
        .getAll()
        .find((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"))

      if (!supabaseSession) {
        const redirectUrl = new URL("/auth/sign-in", request.url)
        redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
        return NextResponse.redirect(redirectUrl)
      }

      // Additional check for admin paths
      if (path.startsWith("/admin")) {
        // Here you would check if the user has admin rights
        // For now, we'll just let it through and assume you'll handle admin checks in the page
      }
    }

    return response
  } catch (error) {
    console.error("Middleware error:", error)
    // Fallback to allowing the request
    return NextResponse.next()
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
