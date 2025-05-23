import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Check critical environment variables
    const missingVars = []

    if (!process.env.PAYLOAD_SECRET) missingVars.push("PAYLOAD_SECRET")
    if (!process.env.POSTGRES_URL) missingVars.push("POSTGRES_URL")

    if (missingVars.length > 0) {
      return NextResponse.json(
        {
          status: "unhealthy",
          error: `Missing required environment variables: ${missingVars.join(", ")}`,
          secretLength: process.env.PAYLOAD_SECRET?.length || 0,
        },
        { status: 500 },
      )
    }

    // All checks passed
    return NextResponse.json({
      status: "healthy",
      message: "All required environment variables are set",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
