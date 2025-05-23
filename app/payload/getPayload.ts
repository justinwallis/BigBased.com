import payload from "payload"
import type { Payload } from "payload"
import config from "./payload.config"

// Cache for the Payload instance
let cachedPayload: Payload | null = null

export const getPayload = async (): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  // Initialize Payload
  try {
    await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      config,
      local: process.env.NODE_ENV !== "production",
    })

    cachedPayload = payload
    return payload
  } catch (error) {
    console.error("Error initializing Payload:", error)
    throw error
  }
}
