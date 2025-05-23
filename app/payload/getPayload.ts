import path from "path"
import payload from "payload"
import type { Payload } from "payload"

// Cache the Payload instance
let cachedPayload: Payload | null = null

export const getPayload = async (): Promise<Payload> => {
  if (cachedPayload) {
    return cachedPayload
  }

  // Get absolute path to config
  const configPath = path.resolve(process.cwd(), "app/payload/payload.config.ts")

  try {
    // Initialize Payload with explicit config path
    if (!payload.initialized) {
      cachedPayload = await payload.init({
        secret: process.env.PAYLOAD_SECRET || "a-very-secret-key",
        local: true,
        configPath,
        // Ensure we're using the correct port
        express: {
          port: process.env.PORT ? Number.parseInt(process.env.PORT) : 3000,
        },
      })
    } else {
      cachedPayload = payload
    }

    return cachedPayload
  } catch (error) {
    console.error("Error initializing Payload:", error)
    throw error
  }
}
