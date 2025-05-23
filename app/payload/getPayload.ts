import dotenv from "dotenv"
import path from "path"
import payload, { type Payload } from "payload"
import type { InitOptions } from "payload/config"

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../.env.local"),
})

// Cache the Payload instance
let cachedPayload: Payload | null = null

// Initialize Payload
export const getPayload = async (options: InitOptions = {}): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  try {
    // Use the root level config path for better compatibility
    const configPath = path.resolve(process.cwd(), "payload.config.ts")

    // Initialize Payload with the config
    const payloadInstance = await payload.init({
      secret: process.env.PAYLOAD_SECRET,
      configPath,
      local: options.local !== false,
      ...(options || {}),
    })

    // Cache the instance
    cachedPayload = payloadInstance

    return payloadInstance
  } catch (error) {
    console.error("Failed to initialize Payload:", error)
    throw error
  }
}
