import { getPayload } from "payload/next"
import config from "./payload.config"

// This creates a client to interact with Payload
export const getPayloadClient = async () => {
  const payload = await getPayload({
    config,
  })

  return payload
}
