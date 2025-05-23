import { getPayload as getPayloadOriginal } from "payload"
import { buildConfig } from "./payload.config"

// Global is used here to maintain a cached connection across hot reloads
// in development. This prevents connections growing exponentially
// during API Route usage.
let cached = (global as any).payload

if (!cached) {
  cached = (global as any).payload = { client: null, promise: null }
}

export const getPayload = async () => {
  if (cached.client) {
    return cached.client
  }

  if (!cached.promise) {
    cached.promise = getPayloadOriginal({
      // Pass the config object
      config: buildConfig(),
      // Make sure we're not trying to initialize Payload again if it's already been initialized
      onInit: async (payload) => {
        cached.client = payload
      },
    })
  }

  try {
    await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.client
}
