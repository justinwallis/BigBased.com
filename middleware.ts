import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

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
    path.startsWith("/api/auth") ||
    path.startsWith("/api/debug") ||
    path.startsWith("/auth/sign-in") ||
    path.startsWith("/auth/sign-up") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/reset-password") ||
    path.startsWith("/auth/callback")

  // Protected paths that require authentication
  const isProtectedPath = path.startsWith("/profile") || path.startsWith("/dashboard")

  // Skip middleware for non-protected paths
  if (!isProtectedPath) {
    return NextResponse.next()
  }

  // Check for Supabase session token in cookies - check more cookie variations
  const supabaseSession =
    request.cookies.get("sb-access-token") ||
    request.cookies.get("supabase-auth-token") ||
    request.cookies.get("sb-" + process.env.NEXT_PUBLIC_SUPABASE_URL?.split("//")[1]?.split(".")[0] + "-auth-token")

  // If it's a protected path and the user is not authenticated,
  // redirect to the sign-in page
  if (isProtectedPath && !supabaseSession) {
    console.log("No session found, redirecting to sign-in. Path:", path)
    console.log(
      "Available cookies:",
      request.cookies.getAll().map((cookie) => cookie.name),
    )
    const redirectUrl = new URL("/auth/sign-in", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Allow access to protected paths if authenticated
  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.svg$|.*\\.ico$).*)",
  ],
}
