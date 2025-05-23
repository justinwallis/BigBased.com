import type { Payload } from "payload"
import payload from "payload"
import path from "path"

// Cache the payload instance
let cachedPayload: Payload | null = null

// Function to get the payload instance
export const getPayload = async (): Promise<Payload> => {
  if (cachedPayload) {
    return cachedPayload
  }

  // Initialize payload if it's not already initialized
  if (!global.payload) {
    const configPath = path.resolve(process.cwd(), "src/app/payload.config.ts")

    cachedPayload = await payload.init({
      secret: process.env.PAYLOAD_SECRET || "a-very-secret-key",
      local: true,
      configPath,
    })
  } else {
    cachedPayload = global.payload
  }

  return cachedPayload
}
