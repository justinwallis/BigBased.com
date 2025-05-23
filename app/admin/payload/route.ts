import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "@/app/payload/getPayload"
import { payloadAuthMiddleware } from "@/app/payload/supabase-auth"

// This route will serve the Payload CMS admin panel
export async function GET(req: NextRequest) {
  try {
    // Apply Supabase auth middleware
    await payloadAuthMiddleware(req)

    // Get the Payload instance
    const payload = await getPayload()

    // Let Payload handle the request
    const res = await payload.admin.getAdminRequestHandler()(req)

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
    // Apply Supabase auth middleware
    await payloadAuthMiddleware(req)

    // Get the Payload instance
    const payload = await getPayload()

    // Let Payload handle the request
    const res = await payload.admin.getAdminRequestHandler()(req)

    return res
  } catch (error) {
    console.error("Error in Payload admin route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
