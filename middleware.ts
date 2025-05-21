import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname

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

  // Check if the user is authenticated
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)
  const {
    data: { session },
  } = await supabase.auth.getSession()
  const isAuthenticated = !!session

  // If it's a protected path and the user is not authenticated,
  // redirect to the sign-in page
  if (isProtectedPath && !isAuthenticated) {
    const redirectUrl = new URL("/auth/sign-in", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

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
