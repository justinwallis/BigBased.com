import { type NextRequest, NextResponse } from "next/server"
import { getPayload } from "@/app/payload/getPayload"
import { headers } from "next/headers"

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const payload = await getPayload()

    // Create a new headers object from the incoming request
    const headersList = headers()
    const referer = headersList.get("referer") || ""

    // Let Payload handle the request
    const res = await payload.request({
      req,
      path: `/${params.path.join("/")}`,
      method: req.method,
      referer,
    })

    return res
  } catch (error) {
    console.error("Error in Payload API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Handle all other HTTP methods
export async function POST(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req, params.path)
}

export async function PUT(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req, params.path)
}

export async function PATCH(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req, params.path)
}

export async function DELETE(req: NextRequest, { params }: { params: { path: string[] } }) {
  return handlePayloadRequest(req, params.path)
}

// Helper function to handle Payload requests
async function handlePayloadRequest(req: NextRequest, path: string[]) {
  try {
    const payload = await getPayload()

    // Create a new headers object from the incoming request
    const headersList = headers()
    const referer = headersList.get("referer") || ""

    // Let Payload handle the request
    const res = await payload.request({
      req,
      path: `/${path.join("/")}`,
      method: req.method,
      referer,
    })

    return res
  } catch (error) {
    console.error("Error in Payload API route:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
