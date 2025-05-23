import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "../../../payload.config"

const handler = async (req: Request): Promise<Response> => {
  const payload = await getPayloadHMR({ config: configPromise })
  return payload.handler(req)
}

export const GET = handler
export const POST = handler
export const PUT = handler
export const DELETE = handler
export const PATCH = handler

// Export getPayload as named export (required)
export const getPayload = async () => {
  return await getPayloadHMR({ config: configPromise })
}
