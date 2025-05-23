import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simple health check that doesn't require full Payload initialization
    if (!process.env.PAYLOAD_SECRET) {
      return NextResponse.json(
        { status: "unhealthy", error: "Missing PAYLOAD_SECRET environment variable" },
        { status: 500 },
      )
    }

    if (!process.env.POSTGRES_URL) {
      return NextResponse.json(
        { status: "unhealthy", error: "Missing POSTGRES_URL environment variable" },
        { status: 500 },
      )
    }

    return NextResponse.json({
      status: "healthy",
      environment: {
        hasSecret: !!process.env.PAYLOAD_SECRET,
        hasDB: !!process.env.POSTGRES_URL,
        hasBlobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
      },
    })
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
