import { getPayload } from "./getPayload"

// Check if we're in a build environment or if Payload is not available
const isPayloadAvailable = () => {
  return (
    process.env.PAYLOAD_SECRET &&
    process.env.POSTGRES_URL &&
    (process.env.VERCEL || process.env.NODE_ENV === "development")
  )
}

export async function getPage(slug: string) {
  if (!isPayloadAvailable()) {
    console.log("Payload not available, skipping page fetch")
    return null
  }

  try {
    const payload = await getPayload()

    const result = await payload.find({
      collection: "pages",
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: "published",
        },
      },
      limit: 1,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    return null
  }
}

export async function getPost(slug: string) {
  if (!isPayloadAvailable()) {
    console.log("Payload not available, skipping post fetch")
    return null
  }

  try {
    const payload = await getPayload()

    const result = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: "published",
        },
      },
      limit: 1,
    })

    return result.docs[0] || null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    return null
  }
}

export async function getPosts(page = 1, limit = 10) {
  if (!isPayloadAvailable()) {
    console.log("Payload not available, returning empty posts")
    return { docs: [], totalPages: 0, page: 1, limit: 10, totalDocs: 0 }
  }

  try {
    const payload = await getPayload()

    const result = await payload.find({
      collection: "posts",
      where: {
        _status: {
          equals: "published",
        },
      },
      sort: "-createdAt",
      page,
      limit,
    })

    return result
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { docs: [], totalPages: 0, page: 1, limit: 10, totalDocs: 0 }
  }
}

export async function getAllPages() {
  if (!isPayloadAvailable()) {
    return []
  }

  try {
    const payload = await getPayload()

    const result = await payload.find({
      collection: "pages",
      where: {
        _status: {
          equals: "published",
        },
      },
      limit: 100,
    })

    return result.docs
  } catch (error) {
    console.error("Error fetching all pages:", error)
    return []
  }
}
