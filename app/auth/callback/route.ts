import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") || "/profile"

  if (code) {
    try {
      const supabase = createServerClient()
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      console.error("Error exchanging code for session:", error)
      // Continue to redirect even if there's an error
    }
  }

  return NextResponse.redirect(new URL(next, request.url))
}
