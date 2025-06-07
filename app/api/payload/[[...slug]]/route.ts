import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "../../../payload/payload"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    console.log("Initializing Payload...")
    const payload = await getPayload()

    console.log("Payload initialized successfully")

    // Handle admin routes
    const url = new URL(request.url)
    if (url.pathname.startsWith("/api/payload/admin")) {
      // Return admin interface
      return new NextResponse("Admin interface would be here", { status: 200 })
    }

    // Handle API routes
    return NextResponse.json({
      message: "Payload CMS API is running",
      collections: payload.config.collections.map((c) => c.slug),
    })
  } catch (error) {
    console.error("Error in Payload API:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload()

    // Handle POST requests to Payload API
    return NextResponse.json({ message: "POST request handled" })
  } catch (error) {
    console.error("Error in Payload POST:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const payload = await getPayload()

    // Handle PUT requests to Payload API
    return NextResponse.json({ message: "PUT request handled" })
  } catch (error) {
    console.error("Error in Payload PUT:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const payload = await getPayload()

    // Handle DELETE requests to Payload API
    return NextResponse.json({ message: "DELETE request handled" })
  } catch (error) {
    console.error("Error in Payload DELETE:", error)
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
