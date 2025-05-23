import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const next = searchParams.get("next") || "/admin"

  // Simple redirect without Supabase
  return NextResponse.redirect(new URL(next, request.url))
}
