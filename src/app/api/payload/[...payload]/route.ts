import { getPayload } from "./lib/payload"

const handler = async (req: Request): Promise<Response> => {
  const payload = await getPayload()
  return payload.handler(req)
}

export { handler as GET, handler as POST, handler as PUT, handler as DELETE, handler as PATCH }
