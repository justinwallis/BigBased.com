import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "../../payload.config"

let cachedPayload: any = null

export const getPayload = async () => {
  if (cachedPayload) {
    return cachedPayload
  }

  try {
    cachedPayload = await getPayloadHMR({ config: configPromise })
    return cachedPayload
  } catch (error) {
    console.error("Error initializing Payload:", error)
    throw error
  }
}
