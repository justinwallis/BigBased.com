import type { NextRequest } from "next/server"
import payload from "payload"
import config from "../../../../payload.config"

let payloadInitialized = false

const initializePayload = async () => {
  if (payloadInitialized) return

  await payload.init({
    config,
    secret: process.env.PAYLOAD_SECRET!,
  })

  payloadInitialized = true
}

const handler = async (req: NextRequest) => {
  await initializePayload()
  return payload.handler(req)
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler
export const OPTIONS = handler
