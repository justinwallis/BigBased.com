import dotenv from "dotenv"
import path from "path"
import { getPayload as getPayloadFromNext } from "@payloadcms/next/dist/utilities"
import type { Payload } from "payload"

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../.env.local"),
})

// Log environment variables for debugging (will be removed in production)
console.log("getPayload Environment Check:", {
  hasSecret: !!process.env.PAYLOAD_SECRET,
  secretLength: process.env.PAYLOAD_SECRET?.length,
  hasDB: !!process.env.POSTGRES_URL,
})

// Cache the Payload instance
let cachedPayload: Payload | null = null

// Initialize Payload
export const getPayloadClient = async (): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  try {
    // Use the Next.js specific Payload initialization with explicit secret
    const payloadInstance = await getPayloadFromNext({
      // Import the config directly to avoid circular dependencies
      configPath: path.resolve(process.cwd(), "payload.config.ts"),
      secret: process.env.PAYLOAD_SECRET,
    })

    // Cache the instance
    cachedPayload = payloadInstance

    return payloadInstance
  } catch (error) {
    console.error("Failed to initialize Payload:", error)
    throw error
  }
}

// Export the original function name for backward compatibility
export const getPayload = getPayloadClient
