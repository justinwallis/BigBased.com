import payload from "payload"
import type { Payload } from "payload/dist/payload"

// Cache the Payload instance
let cachedPayload: Payload | null = null

export const getPayload = async (): Promise<Payload> => {
  if (cachedPayload) {
    return cachedPayload
  }

  // Initialize Payload
  const initPayload = await payload.init({
    secret: process.env.PAYLOAD_SECRET || "a-very-secret-key-that-should-be-changed",
    local: true,
    onInit: () => {
      console.log("Payload initialized")
    },
  })

  cachedPayload = initPayload
  return initPayload
}
