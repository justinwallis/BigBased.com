import dotenv from "dotenv"
import path from "path"
import { getPayloadHMR } from "@payloadcms/next/utilities"
import type { Payload } from "payload"

// Load environment variables
dotenv.config({
  path: path.resolve(__dirname, "../../.env.local"),
})

// Cache the Payload instance
let cachedPayload: Payload | null = null

// Initialize Payload
export const getPayload = async (): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  try {
    // Use the Next.js specific Payload initialization
    const configPath = path.resolve(process.cwd(), "payload.config.ts")

    const payloadInstance = await getPayloadHMR({
      config: configPath,
    })

    // Cache the instance
    cachedPayload = payloadInstance

    return payloadInstance
  } catch (error) {
    console.error("Failed to initialize Payload:", error)
    throw error
  }
}
