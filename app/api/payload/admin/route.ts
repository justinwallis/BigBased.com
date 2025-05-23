import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"

// Initialize Payload if it hasn't been initialized yet
const initPayload = async () => {
  // Check if payload is already initialized
  if (payload.initialized) return payload

  try {
    // Initialize payload
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || "",
      local: true,
      // This is needed for Vercel serverless environment
      express: null,
    })

    return payload
  } catch (error) {
    console.error("Error initializing Payload:", error)
    throw error
  }
}

// Handle admin panel requests
export async function GET(req: NextRequest) {
  try {
    // Initialize Payload
    const payloadInstance = await initPayload()

    // Serve the admin UI
    const adminHTML = await payloadInstance.admin.getAdminUI({
      req: {
        url: req.url,
        headers: Object.fromEntries(req.headers),
        method: req.method,
      },
    })

    // Return the admin UI
    return new NextResponse(adminHTML, {
      status: 200,
      headers: {
        "Content-Type": "text/html",
      },
    })
  } catch (error) {
    console.error("Error serving admin UI:", error)
    return NextResponse.json(
      {
        error: "Failed to serve admin UI",
        details: error instanceof Error ? error.message : String(error),
        stack: process.env.NODE_ENV === "development" ? (error instanceof Error ? error.stack : undefined) : undefined,
      },
      { status: 500 },
    )
  }
}
