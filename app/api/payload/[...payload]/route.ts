import { type NextRequest, NextResponse } from "next/server"
import payload from "payload"
import config from "@/app/payload/payload.config"

// Initialize Payload only once
let initialized = false

async function initializePayload() {
  if (initialized) return

  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET || "your-payload-secret",
      config,
    })
    initialized = true
  } catch (error) {
    console.error("Failed to initialize Payload:", error)
    throw error
  }
}

export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    await initializePayload()
    const { res } = await payload.handle({
      req,
      route: params.payload.join("/"),
    })
    return res
  } catch (error) {
    console.error("Payload GET request failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Payload request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    await initializePayload()
    const { res } = await payload.handle({
      req,
      route: params.payload.join("/"),
    })
    return res
  } catch (error) {
    console.error("Payload POST request failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Payload request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function PUT(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    await initializePayload()
    const { res } = await payload.handle({
      req,
      route: params.payload.join("/"),
    })
    return res
  } catch (error) {
    console.error("Payload PUT request failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Payload request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { payload: string[] } }) {
  try {
    await initializePayload()
    const { res } = await payload.handle({
      req,
      route: params.payload.join("/"),
    })
    return res
  } catch (error) {
    console.error("Payload DELETE request failed:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Payload request failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
