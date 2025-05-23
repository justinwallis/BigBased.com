import { type NextRequest, NextResponse } from "next/server"
import express from "express"
import payload from "payload"
import { getPayload } from "../../../payload/getPayload"

// This is a workaround for the fact that Next.js doesn't support Express directly
// We're creating a simple Express app to handle Payload requests
const app = express()

// Initialize Payload
let payloadInitialized = false

export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return handleRequest(req, params)
}

export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return handleRequest(req, params)
}

export async function PUT(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return handleRequest(req, params)
}

export async function DELETE(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return handleRequest(req, params)
}

export async function PATCH(req: NextRequest, { params }: { params: { payload: string[] } }) {
  return handleRequest(req, params)
}

export const dynamic = "force-dynamic"

async function handleRequest(req: NextRequest, params: { payload: string[] }) {
  try {
    // Initialize Payload if not already initialized
    if (!payloadInitialized) {
      await getPayload()
      payloadInitialized = true
    }

    // Convert NextRequest to Express request
    const url = new URL(req.url)
    const path = `/${params.payload.join("/")}${url.search}`

    // Create a mock Express request
    const expressReq = {
      method: req.method,
      path,
      url: path,
      query: Object.fromEntries(url.searchParams),
      headers: Object.fromEntries(req.headers),
      body: req.body ? await req.json() : undefined,
      cookies: Object.fromEntries(req.cookies),
    }

    // Create a mock Express response
    let statusCode = 200
    let responseBody: any = null
    const responseHeaders: Record<string, string> = {}

    const expressRes = {
      status: (code: number) => {
        statusCode = code
        return expressRes
      },
      json: (body: any) => {
        responseBody = body
        return expressRes
      },
      send: (body: any) => {
        responseBody = body
        return expressRes
      },
      setHeader: (name: string, value: string) => {
        responseHeaders[name] = value
        return expressRes
      },
      getHeader: (name: string) => responseHeaders[name],
      end: () => {},
    }

    // Process the request through Payload
    await new Promise<void>((resolve) => {
      payload.express.requestHandlers.forEach((handler) => {
        handler(expressReq as any, expressRes as any, () => {
          resolve()
        })
      })
    })

    // Return the response
    return NextResponse.json(responseBody, {
      status: statusCode,
      headers: responseHeaders,
    })
  } catch (error) {
    console.error("Error handling Payload request:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
