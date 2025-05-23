import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "../../../payload.config"

let cachedPayload: any = null

export const getPayload = async () => {
  if (!cachedPayload) {
    cachedPayload = await getPayloadHMR({ config: configPromise })
  }
  return cachedPayload
}
