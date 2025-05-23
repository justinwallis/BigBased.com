import configPromise from "@payload-config"
import { getPayload } from "payload"

export const getPayloadClient = async () => {
  const config = await configPromise
  const payload = await getPayload({ config })
  return payload
}
