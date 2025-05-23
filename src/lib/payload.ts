import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@/payload.config"

export const getPayload = async () => {
  const payload = await getPayloadHMR({ config: configPromise })
  return payload
}
