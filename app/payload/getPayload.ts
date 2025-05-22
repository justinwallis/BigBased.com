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

  // Initialize Payload
  const payload = await initializePayload(options)

  // Cache the instance
  cachedPayload = payload

  return payload
}

// Initialize Payload with the given options
const initializePayload = async (options: InitOptions = {}): Promise<Payload> => {
  const payloadInstance = await payload.init({
    secret: process.env.PAYLOAD_SECRET || "your-payload-secret",
    local: options.local !== false,
    ...(options || {}),
  })

  return payloadInstance
}
