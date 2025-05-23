import type { NextRequest } from "next/server"
import { getPayload } from "@/app/payload/getPayload"

// This route will serve the Payload API
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    // Get the Payload instance
    const payload = await getPayload()

    // Let Payload handle the request
    const res = await payload.api.getAPIRequestHandler()(req)

    return res
  } catch (error) {
    console.error("Error in Payload API route:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}

// Handle all other HTTP methods
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadAPIRequest(req)
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadAPIRequest(req)
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadAPIRequest(req)
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadAPIRequest(req)
}

// Helper function to handle Payload API requests
async function handlePayloadAPIRequest(req: NextRequest) {
  try {
    // Get the Payload instance
    const payload = await getPayload()

    // Let Payload handle the request
    const res = await payload.api.getAPIRequestHandler()(req)

    return res
  } catch (error) {
    console.error("Error in Payload API route:", error)
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }
}
