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

// Handle all Payload API requests
export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payloadInstance = await initPayload()

    // Get the path from the URL
    const path = `/${params.payload.join("/")}`

    // Process the request through Payload
    const result = await payloadInstance.request({
      method: "get",
      url: path,
      headers: Object.fromEntries(req.headers),
    })

    // Return the result
    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    console.error("Error processing Payload API request:", error)
    return NextResponse.json(
      {
        error: "Failed to process Payload API request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

// Support other HTTP methods
export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payloadInstance = await initPayload()
    const path = `/${params.payload.join("/")}`
    const body = await req.json()

    const result = await payloadInstance.request({
      method: "post",
      url: path,
      headers: Object.fromEntries(req.headers),
      body,
    })

    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    console.error("Error processing Payload API request:", error)
    return NextResponse.json(
      {
        error: "Failed to process Payload API request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payloadInstance = await initPayload()
    const path = `/${params.payload.join("/")}`
    const body = await req.json()

    const result = await payloadInstance.request({
      method: "put",
      url: path,
      headers: Object.fromEntries(req.headers),
      body,
    })

    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    console.error("Error processing Payload API request:", error)
    return NextResponse.json(
      {
        error: "Failed to process Payload API request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payloadInstance = await initPayload()
    const path = `/${params.payload.join("/")}`

    const result = await payloadInstance.request({
      method: "delete",
      url: path,
      headers: Object.fromEntries(req.headers),
    })

    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    console.error("Error processing Payload API request:", error)
    return NextResponse.json(
      {
        error: "Failed to process Payload API request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    const payloadInstance = await initPayload()
    const path = `/${params.payload.join("/")}`
    const body = await req.json()

    const result = await payloadInstance.request({
      method: "patch",
      url: path,
      headers: Object.fromEntries(req.headers),
      body,
    })

    return NextResponse.json(result.data, { status: result.status })
  } catch (error) {
    console.error("Error processing Payload API request:", error)
    return NextResponse.json(
      {
        error: "Failed to process Payload API request",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
