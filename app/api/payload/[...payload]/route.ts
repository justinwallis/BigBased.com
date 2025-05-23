import { createNextPayloadHandler } from "@payloadcms/next"
import { type NextRequest, NextResponse } from "next/server"
import path from "path"

// Log environment variables for debugging (will be removed in production)
console.log("API Route Environment Check:", {
  hasSecret: !!process.env.PAYLOAD_SECRET,
  secretLength: process.env.PAYLOAD_SECRET?.length,
  hasDB: !!process.env.POSTGRES_URL,
})

// Create a Payload handler with explicit secret
const payloadHandler = createNextPayloadHandler({
  // Use path to config instead of importing directly
  configPath: path.resolve(process.cwd(), "payload.config.ts"),
  secret: process.env.PAYLOAD_SECRET,
})

// Handle all Payload requests
export async function GET(req: NextRequest) {
  return await payloadHandler(req)
}

export async function POST(req: NextRequest) {
  return await payloadHandler(req)
}

export async function PATCH(req: NextRequest) {
  return await payloadHandler(req)
}

export async function PUT(req: NextRequest) {
  return await payloadHandler(req)
}

export async function DELETE(req: NextRequest) {
  return await payloadHandler(req)
}

// Health check endpoint
export async function HEAD(req: NextRequest) {
  try {
    // Simple health check that doesn't require full Payload initialization
    if (req.nextUrl.pathname === "/api/payload/health") {
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

      return NextResponse.json({ status: "healthy" })
    }

    return await payloadHandler(req)
  } catch (error) {
    console.error("Health check error:", error)
    return NextResponse.json(
      { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}
