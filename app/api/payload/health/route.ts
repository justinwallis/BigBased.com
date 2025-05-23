import { NextResponse } from "next/server"
import { getPayload } from "../../../payload/getPayload"

export async function GET() {
  try {
    // Check if Payload is available
    if (!process.env.PAYLOAD_SECRET || !process.env.POSTGRES_URL) {
      return NextResponse.json({ status: "error", message: "Payload configuration missing" }, { status: 500 })
    }

    // Try to initialize Payload
    const payload = await getPayload()

    // Try a simple query to test database connection
    await payload.find({
      collection: "users",
      limit: 1,
    })

    return NextResponse.json({
      status: "healthy",
      message: "Payload CMS is running correctly",
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Payload health check failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Payload CMS is not available",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
