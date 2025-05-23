import { getPayloadClient } from "payload/dist/payload"
import config from "./payload.config"

// Cache the Payload instance
let cachedPayload: any = null

export const getPayload = async () => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  // Initialize Payload
  const payload = await getPayloadClient({
    // Pass the config object
    config,
    // Set the options
    options: {
      local: true,
      secret: process.env.PAYLOAD_SECRET,
    },
  })

  cachedPayload = payload

  return payload
}
