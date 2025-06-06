import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Add rate limiting map
const rateLimitMap = new Map<string, { count: number; lastReset: number }>()

// Bot detection patterns
const botPatterns = [
  /bot/i,
  /crawler/i,
  /spider/i,
  /scraper/i,
  /facebookexternalhit/i,
  /twitterbot/i,
  /linkedinbot/i,
  /whatsapp/i,
  /telegram/i,
  /slack/i,
  /curl/i,
  /wget/i,
  /python/i,
  /java/i,
  /postman/i,
  /insomnia/i,
  /httpie/i,
]

function isBot(userAgent: string): boolean {
  return botPatterns.some((pattern) => pattern.test(userAgent))
}

function rateLimit(ip: string, limit = 60, windowMs = 60000): boolean {
  const now = Date.now()
  const userLimit = rateLimitMap.get(ip)

  if (!userLimit || now - userLimit.lastReset > windowMs) {
    rateLimitMap.set(ip, { count: 1, lastReset: now })
    return false
  }

  if (userLimit.count >= limit) {
    return true
  }

  userLimit.count++
  return false
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const userAgent = request.headers.get("user-agent") || ""
  const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown"

  // Enhanced bot detection
  if (isBot(userAgent)) {
    console.log(`🤖 Bot detected: ${userAgent}`)
    return new NextResponse("Bot access denied", { status: 403 })
  }

  // Rate limiting
  if (rateLimit(ip, 30, 60000)) {
    // 30 requests per minute
    console.log(`⚡ Rate limit exceeded for IP: ${ip}`)
    return new NextResponse("Rate limit exceeded", { status: 429 })
  }

  // Get the pathname of the request
  // Rest of your existing middleware logic...
  const shouldSkipMiddleware =
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

  // Only log for debugging when needed
  if (process.env.NODE_ENV === "development") {
    console.log(`🔍 Middleware checking: ${path}`)
  }

  // Rest of your existing logic...
  if (path === "/profile/security") {
    return NextResponse.redirect(new URL("/profile?tab=security", request.url))
  }

  const isPublicPath =
    path === "/" ||
    path === "/about" ||
    path === "/features" ||
    path === "/partners" ||
    path === "/contact" ||
    path === "/transform" ||
    path === "/faq" ||
    path === "/revolution" ||
    path.startsWith("/auth/sign-in") ||
    path.startsWith("/auth/sign-up") ||
    path.startsWith("/auth/signup") ||
    path.startsWith("/auth/forgot-password") ||
    path.startsWith("/auth/reset-password") ||
    path.startsWith("/auth/callback") ||
    path.startsWith("/account-recovery") ||
    path.startsWith("/checkout") ||
    path.match(/^\/[^/]+$/)

  const isProtectedPath = path.startsWith("/profile") || path.startsWith("/dashboard")

  if (isPublicPath && !isProtectedPath) {
    return NextResponse.next()
  }

  if (isProtectedPath) {
    const supabaseSession =
      request.cookies.get("sb-access-token") ||
      request.cookies.get("supabase-auth-token") ||
      request.cookies.get("sb-zcmjnapixchrzafkbzhq-auth-token") ||
      request.cookies.getAll().find((cookie) => cookie.name.startsWith("sb-") && cookie.name.includes("-auth-token"))

    if (!supabaseSession) {
      const redirectUrl = new URL("/auth/sign-in", request.url)
      redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
