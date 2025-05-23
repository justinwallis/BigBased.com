import { NextResponse } from "next/server"

export async function GET() {
  try {
    const envCheck = {
      PAYLOAD_SECRET: !!process.env.PAYLOAD_SECRET,
      POSTGRES_URL: !!process.env.POSTGRES_URL,
      NEXT_PUBLIC_BASE_URL: !!process.env.NEXT_PUBLIC_BASE_URL,
      SUPABASE_URL: !!process.env.SUPABASE_URL,
      NODE_ENV: process.env.NODE_ENV,
    }

    // Try to import Payload config
    let configStatus = "unknown"
    try {
      await import("@/app/payload/payload.config")
      configStatus = "loaded"
    } catch (error) {
      configStatus = `error: ${error instanceof Error ? error.message : "unknown"}`
    }

    return NextResponse.json({
      environment: envCheck,
      configStatus,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
