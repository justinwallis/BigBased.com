import { getPayloadHMR } from "@payloadcms/next/utilities"
import configPromise from "../../payload.config"
// import { getPayload } from "../app/api/payload/[...payload]/route" // Removed to fix redeclaration

let cachedPayload: any = null

export const getPayload = async () => {
  if (cachedPayload) {
    return cachedPayload
  }

  cachedPayload = await getPayloadHMR({ config: configPromise })
  return cachedPayload
}

export const getPayloadClient = getPayload

// Helper function to fetch posts from Payload CMS
export async function getPosts({ limit = 10, page = 1, where = {} } = {}) {
  const payload = await getPayload()

  const { docs, hasNextPage, hasPrevPage, nextPage, prevPage, totalDocs, totalPages } = await payload.find({
    collection: "posts",
    where: {
      status: {
        equals: "published",
      },
      ...where,
    },
    sort: "-publishedDate",
    limit,
    page,
    depth: 1,
  })

  return {
    posts: docs,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalDocs,
    totalPages,
  }
}

// Helper function to fetch a single post by slug
export async function getPostBySlug(slug: string) {
  const payload = await getPayload()

  const post = await payload.find({
    collection: "posts",
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: "published",
      },
    },
    depth: 2,
  })

  if (!post.docs[0]) {
    return null
  }

  return post.docs[0]
}

// Helper function to fetch pages from Payload CMS
export async function getPages() {
  const payload = await getPayload()

  const { docs } = await payload.find({
    collection: "pages",
    where: {
      status: {
        equals: "published",
      },
    },
    depth: 1,
  })

  return docs
}

// Helper function to fetch a single page by slug
export async function getPageBySlug(slug: string) {
  const payload = await getPayload()

  const page = await payload.find({
    collection: "pages",
    where: {
      slug: {
        equals: slug,
      },
      status: {
        equals: "published",
      },
    },
  })

  if (!page.docs[0]) {
    return null
  }

  return page.docs[0]
}
