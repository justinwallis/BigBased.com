import { getPayload } from "payload/dist/payload"
import type { Payload } from "payload"

let cachedPayload: Payload | null = null

export async function getPayloadClient(): Promise<Payload> {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  // Initialize Payload
  const payload = await getPayload({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
  })

  cachedPayload = payload

  return payload
}
