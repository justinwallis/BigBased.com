import payload from "payload"
import type { Payload } from "payload"
import config from "./payload.config"

// Track if Payload has been initialized
const cached = global as unknown as {
  payload?: Payload
}

if (!cached.payload) {
  cached.payload = undefined
}

// Initialize Payload once and reuse the instance
export async function getPayload(): Promise<Payload> {
  if (cached.payload) {
    return cached.payload
  }

  // Only initialize in server environment
  if (typeof window === "undefined") {
    try {
      // Initialize Payload
      await payload.init({
        secret: process.env.PAYLOAD_SECRET || "big-based-secret-key",
        config,
        local: process.env.NODE_ENV !== "production",
      })

      cached.payload = payload
      return payload
    } catch (error) {
      console.error("Error initializing Payload:", error)
      throw error
    }
  }

  throw new Error("Payload cannot be initialized on the client side")
}
