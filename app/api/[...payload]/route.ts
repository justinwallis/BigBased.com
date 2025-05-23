import { createPayloadClient } from "payload"
import { type NextRequest, NextResponse } from "next/server"
import config from "@/src/payload.config"
import path from "path"

// This is a workaround for the fact that Next.js doesn't allow us to use path aliases in API routes
// @ts-ignore
global.appRoot = path.join(process.cwd())

// Initialize Payload
let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = {
    client: null,
    promise: null,
  }
}

export async function getPayloadClient() {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = createPayloadClient({
      config,
    })
  }

  try {
    cached.client = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}

// This route handles all Payload CMS requests
export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  const payload = await getPayloadClient()
  const { pathname, searchParams } = new URL(req.url)

  // Handle admin requests
  if (pathname === "/api/admin" || pathname.startsWith("/api/admin/")) {
    try {
      const html = await payload.admin.getAdminUI()
      return new NextResponse(html, {
        headers: {
          "Content-Type": "text/html",
        },
      })
    } catch (error) {
      console.error("Error serving admin UI:", error)
      return NextResponse.json({ error: "Failed to serve admin UI", details: String(error) }, { status: 500 })
    }
  }

  // Handle API requests
  try {
    const result = await payload.request({
      url: pathname.replace("/api", ""),
      method: "GET",
      query: Object.fromEntries(searchParams),
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error handling Payload request:", error)
    return NextResponse.json({ error: "Failed to handle request", details: String(error) }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const payload = await getPayloadClient()
  const { pathname } = new URL(req.url)
  const body = await req.json()

  try {
    const result = await payload.request({
      url: pathname.replace("/api", ""),
      method: "POST",
      body,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error handling Payload request:", error)
    return NextResponse.json({ error: "Failed to handle request", details: String(error) }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  const payload = await getPayloadClient()
  const { pathname } = new URL(req.url)
  const body = await req.json()

  try {
    const result = await payload.request({
      url: pathname.replace("/api", ""),
      method: "PUT",
      body,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error handling Payload request:", error)
    return NextResponse.json({ error: "Failed to handle request", details: String(error) }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const payload = await getPayloadClient()
  const { pathname, searchParams } = new URL(req.url)

  try {
    const result = await payload.request({
      url: pathname.replace("/api", ""),
      method: "DELETE",
      query: Object.fromEntries(searchParams),
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error handling Payload request:", error)
    return NextResponse.json({ error: "Failed to handle request", details: String(error) }, { status: 500 })
  }
}
