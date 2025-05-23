import { NextResponse } from "next/server"

export async function GET() {
  // Check environment variables
  const environment = {
    PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
    PAYLOAD_SECRET_LENGTH: process.env.PAYLOAD_SECRET ? process.env.PAYLOAD_SECRET.length : 0,
    POSTGRES_URL: !!process.env.POSTGRES_URL,
    NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
    SUPABASE_URL: !!process.env.SUPABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
  }

  // Check if config can be loaded
  let configStatus = "not loaded"
  try {
    // Try to import the config
    await import("@/app/payload/payload.config")
    configStatus = "loaded"
  } catch (error) {
    configStatus = `error: ${error instanceof Error ? error.message : "unknown error"}`
  }

  return NextResponse.json({
    environment,
    configStatus,
    timestamp: new Date().toISOString(),
  })
}
