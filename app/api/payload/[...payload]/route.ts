import type { NextRequest } from "next/server"
import { getPayload } from "@/app/payload/getPayload"
import { payloadAuthMiddleware } from "@/app/payload/supabase-auth"

export async function GET(req: NextRequest, { params }: { params: { payload: string[] } }) {
  // Authenticate the request
  await payloadAuthMiddleware(req)

  // Initialize Payload
  const payload = await getPayload()

  // Pass the request to Payload
  const { res } = await payload.handle({ req, route: params.payload.join("/") })

  return res
}

export async function POST(req: NextRequest, { params }: { params: { payload: string[] } }) {
  // Authenticate the request
  await payloadAuthMiddleware(req)

  // Initialize Payload
  const payload = await getPayload()

  // Pass the request to Payload
  const { res } = await payload.handle({ req, route: params.payload.join("/") })

  return res
}

export async function PUT(req: NextRequest, { params }: { params: { payload: string[] } }) {
  // Authenticate the request
  await payloadAuthMiddleware(req)

  // Initialize Payload
  const payload = await getPayload()

  // Pass the request to Payload
  const { res } = await payload.handle({ req, route: params.payload.join("/") })

  return res
}

export async function DELETE(req: NextRequest, { params }: { params: { payload: string[] } }) {
  // Authenticate the request
  await payloadAuthMiddleware(req)

  // Initialize Payload
  const payload = await getPayload()

  // Pass the request to Payload
  const { res } = await payload.handle({ req, route: params.payload.join("/") })

  return res
}
