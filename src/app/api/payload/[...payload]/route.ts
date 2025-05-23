import { getPayloadClient } from "@payloadcms/next/getPayloadClient"
import { nextHandler } from "@payloadcms/next/handlers"
import config from "../../../payload.config"

// This is the default handler for Payload routes
const handler = nextHandler({
  config,
})

export const GET = handler
export const POST = handler
export const PUT = handler
export const PATCH = handler
export const DELETE = handler

// Export the Payload client for use in server components
export const getPayload = async () => {
  return getPayloadClient({
    config,
  })
}
