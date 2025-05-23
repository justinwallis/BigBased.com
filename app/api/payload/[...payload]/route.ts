import { type NextRequest, NextResponse } from "next/server"
import express from "express"
import payload from "payload"
import { getPayload } from "../../../payload/getPayload"

// This is a workaround for the fact that Next.js API routes don't support the full Express API
// We're creating a minimal Express app to handle Payload CMS requests
const app = express()

// Initialize Payload CMS
let initialized = false

export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return await handleRequest("POST", req, params)
}

export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return await handleRequest("GET", req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return await handleRequest("PUT", req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return await handleRequest("DELETE", req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return await handleRequest("PATCH", req, params)
}

export const dynamic = "force-dynamic"

async function handleRequest(method: string, req: NextRequest, params: { payload: string[] }) {
  try {
    // Initialize Payload CMS if not already initialized
    if (!initialized) {
      await getPayload()
      initialized = true
    }

    // Construct the path that Payload should handle
    const path = ["api", ...params.payload].join("/")

    // Get the request body if it exists
    let body = null
    if (method !== "GET" && method !== "HEAD") {
      body = await req.json().catch(() => ({}))
    }

    // Convert headers from NextRequest to a format Payload expects
    const headers: Record<string, string> = {}
    req.headers.forEach((value, key) => {
      headers[key] = value
    })

    // Call Payload's local API
    const result = await payload.local.request({
      method,
      path,
      body,
      headers,
    })

    // Return the result as a NextResponse
    return NextResponse.json(result.body, { status: result.status })
  } catch (error) {
    console.error("Payload API error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
