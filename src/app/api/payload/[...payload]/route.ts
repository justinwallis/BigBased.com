import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "@/payload.config"

const handler = async (req: Request): Promise<Response> => {
  const payload = await getPayloadHMR({ config: configPromise })
  return payload.handler(req)
}

export const dynamic = "force-dynamic"

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }
