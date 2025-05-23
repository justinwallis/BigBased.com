import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "@/app/payload/getPayload"
import { headers } from "next/headers"

// This is a catch-all route handler for Payload admin
export async function GET(req: NextRequest) {
  try {
    const payload = await getPayload()

    // Create a new headers object from the incoming request
    const headersList = headers()
    const referer = headersList.get("referer") || ""

    // Let Payload handle the admin request
    const res = await payload.admin.getRequestHandler({
      req,
      referer,
    })

    return res
  } catch (error) {
    console.error("Error in Payload admin route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Handle all other HTTP methods
export async function POST(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function PUT(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function PATCH(req: NextRequest) {
  return handlePayloadRequest(req)
}

export async function DELETE(req: NextRequest) {
  return handlePayloadRequest(req)
}

// Helper function to handle Payload requests
async function handlePayloadRequest(req: NextRequest) {
  try {
    const payload = await getPayload()

    // Create a new headers object from the incoming request
    const headersList = headers()
    const referer = headersList.get("referer") || ""

    // Let Payload handle the request
    const res = await payload.admin.getRequestHandler({
      req,
      referer,
    })

    return res
  } catch (error) {
    console.error("Error in Payload admin route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
