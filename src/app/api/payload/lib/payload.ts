import { getPayloadClient } from "payload/client"
import type { Payload } from "payload"
import configPromise from "../../../payload.config"

// Cache the Payload instance
let cachedPayload: Payload | null = null

// Function to get the Payload instance
export async function getPayload(): Promise<Payload> {
  if (cachedPayload) {
    return cachedPayload
  }

  // Initialize Payload
  const payload = await getPayloadClient({
    config: configPromise,
  })

  cachedPayload = payload
  return payload
}
