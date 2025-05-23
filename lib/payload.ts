import payload from "payload"
import type { Payload } from "payload"

let cachedPayload: Payload | null = null

export const getPayloadClient = async (): Promise<Payload> => {
  if (!process.env.PAYLOAD_SECRET) {
    throw new Error("PAYLOAD_SECRET environment variable is missing")
  }

  if (cachedPayload) {
    return cachedPayload
  }

  const payloadInstance = await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    local: true,
  })

  cachedPayload = payloadInstance
  return payloadInstance
}

// Helper functions for common operations
export const getPages = async () => {
  const payload = await getPayloadClient()
  return await payload.find({
    collection: "pages",
    where: {
      status: {
        equals: "published",
      },
    },
  })
}

export const getPosts = async () => {
  const payload = await getPayloadClient()
  return await payload.find({
    collection: "posts",
    where: {
      status: {
        equals: "published",
      },
    },
    sort: "-publishedAt",
  })
}

export const getPageBySlug = async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: "published",
      },
    },
    limit: 1,
  })
  return result.docs[0] || null
}

export const getPostBySlug = async (slug: string) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: "posts",
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: "published",
      },
    },
    limit: 1,
  })
  return result.docs[0] || null
}
