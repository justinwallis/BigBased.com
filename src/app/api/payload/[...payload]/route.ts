import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "../../../../payload.config"

// Create the getPayload function
export const getPayload = async () => {
  return await getPayloadHMR({ config: configPromise })
}

const handler = async (req: Request): Promise<Response> => {
  const payload = await getPayload()
  return payload.handler(req)
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }
