import type { NextRequest } from "next/server"
import { getPayload } from "@/app/payload/getPayload"
import { headers } from "next/headers"

// This is a catch-all route handler for Payload API
export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const payload = await getPayload()

    // Create a new headers object from the incoming request
    const headersList = headers()
    const referer = headersList.get("referer") || ""

    // Let Payload handle the API request
    const res = await payload.api.getRequestHandler({
      req,
      referer,
    })

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
    const payload = await getPayload()

    // Create a new headers object from the incoming request
    const headersList = headers()
    const referer = headersList.get("referer") || ""

    // Let Payload handle the API request
    const res = await payload.api.getRequestHandler({
      req,
      referer,
    })

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
