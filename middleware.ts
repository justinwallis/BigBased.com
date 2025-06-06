import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { siteConfig } from "@/lib/site-config"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const hostname = request.headers.get("host") || ""

  // Skip middleware entirely for static assets and API routes that don't need auth
  const shouldSkipMiddleware =
    // Static files
    path.startsWith("/_next/") ||
    path.startsWith("/static/") ||
    path.startsWith("/public/") ||
    (path.includes(".") &&
      (path.endsWith(".png") ||
        path.endsWith(".jpg") ||
        path.endsWith(".jpeg") ||
        path.endsWith(".gif") ||
        path.endsWith(".svg") ||
        path.endsWith(".ico") ||
        path.endsWith(".css") ||
        path.endsWith(".js") ||
        path.endsWith(".woff") ||
        path.endsWith(".woff2") ||
        path.endsWith(".ttf") ||
        path.endsWith(".eot") ||
        path.endsWith(".pdf") ||
        path.endsWith(".mp4") ||
        path.endsWith(".webm") ||
        path.endsWith(".mp3") ||
        path.endsWith(".wav"))) ||
    // API routes that don't need auth
    path.startsWith("/api/auth") ||
    path.startsWith("/api/debug") ||
    path === "/api/notifications/send" ||
    path.startsWith("/debug-static") ||
    // Specific files
    path === "/favicon.ico" ||
    path === "/robots.txt" ||
    path === "/sitemap.xml" ||
    path === "/manifest.json" ||
    path === "/browserconfig.xml" ||
    path === "/site.webmanifest"

  if (shouldSkipMiddleware) {
    return NextResponse.next()
  }

  // Check if page is site-specific and redirect if accessed from wrong domain
  const pageAccess = siteConfig.pageAccess[path as keyof typeof siteConfig.pageAccess]

  if (pageAccess === "bigbased" && hostname.includes("basedbook.com")) {
    // Redirect BasedBook users trying to access BigBased-only pages
    return NextResponse.redirect(new URL("/", request.url))
  }

  if (pageAccess === "basedbook" && hostname.includes("bigbased.com")) {
    // Redirect BigBased users trying to access BasedBook-only pages
    return NextResponse.redirect(new URL("/", request.url))
  }

  console.log(`🔍 Middleware checking: ${path}`)

  // Handle specific redirects
  if (path === "/profile/security") {
    return NextResponse.redirect(new URL("/profile?tab=security", request.url))
  }

  // Public paths that don't require authentication
  const isPublicPath =
    path === "/" ||
    path === "/about" ||
    path === "/features" ||
    path === "/partners" ||
    path === "/contact" ||
    path === "/transform" ||
    path === "/faq" ||
    path === "/revolution" ||
    path === "/library" ||
    path === "/authors" ||
    path === "/collections" ||
    path === "/books" ||
    path === "/voting" ||
    path.startsWith("/auth/sign-in") ||
    path.startsWith("/auth/sign-up") ||
    path.startsWith("/auth/signup") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/reset-password") ||
    path.startsWith("/auth/callback") ||
    path.startsWith("/account-recovery") ||
    path.startsWith("/checkout") ||
    // Public profile pages (shared across both sites)
    path.match(/^\/[^/]+$/) // matches /username pattern

  // Protected paths that require authentication
  const isProtectedPath = path.startsWith("/profile") || path.startsWith("/dashboard")

  // Skip middleware for public paths
  if (isPublicPath && !isProtectedPath) {
    return NextResponse.next()
  }

  // Only check auth for protected paths
  if (isProtectedPath) {
    // Check for Supabase session token in cookies
    const supabaseSession =
      request.cookies.get("sb-access-token") ||
      request.cookies.get("supabase-auth-token") ||
      request.cookies.get("sb-zcmjnapixchrzafkbzhq-auth-token") ||
      request.cookies.getAll().find((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"))

    // If it's a protected path and the user is not authenticated,
    // redirect to the sign-in page
    if (!supabaseSession) {
      console.log("🔒 No session found, redirecting to sign-in. Path:", path)
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Allow access
  return NextResponse.next()
}

// Simplified matcher - let the middleware logic handle the filtering
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
