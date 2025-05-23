import dotenv from "dotenv"
import path from "path"
import payload, { type Payload } from "payload"
import type { InitOptions } from "payload/config"

// Cache the Payload instance
let cachedPayload: Payload | null = null

// Initialize Payload
export const getPayload = async (options: InitOptions = {}): Promise<Payload> => {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL environment variable is missing")
  }

  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  // Load environment variables from .env file
  dotenv.config({
    path: path.resolve(__dirname, "../../.env"),
  })

  // Initialize Payload
  const payloadInstance = await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: options.local || false,
    ...(options || {}),
  })

  // Cache the Payload instance in production
  if (process.env.NODE_ENV === "production") {
    cachedPayload = payloadInstance
  }

  return payloadInstance
}
