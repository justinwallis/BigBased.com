import { getPayload } from "./getPayload"

/**
 * Fetches published posts from the database
 */
export async function getPosts({ page = 1, limit = 10 } = {}) {
  try {
    const payload = await getPayload()

    const posts = await payload.find({
      collection: "posts",
      where: {
        _status: {
          equals: "published",
        },
      },
      sort: "-createdAt",
      page,
      limit,
      depth: 1,
    })

    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return {
      docs: [],
      totalDocs: 0,
      totalPages: 0,
      page: 1,
      limit,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    }
  }
}

/**
 * Fetches a single post by slug
 * @deprecated Use getPostBySlug instead
 */
export async function getPost(slug: string) {
  return getPostBySlug(slug)
}

/**
 * Fetches a single post by slug
 */
export async function getPostBySlug(slug: string) {
  try {
    const payload = await getPayload()

    const posts = await payload.find({
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
      depth: 2,
    })

    return posts.docs[0] || null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    return null
  }
}

/**
 * Fetches a single page by slug
 * @deprecated Use getPageBySlug instead
 */
export async function getPage(slug: string) {
  return getPageBySlug(slug)
}

/**
 * Fetches a single page by slug
 */
export async function getPageBySlug(slug: string) {
  try {
    const payload = await getPayload()

    const pages = await payload.find({
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
      depth: 2,
    })

    return pages.docs[0] || null
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    return null
  }
}

/**
 * Fetches all published pages
 */
export async function getAllPages() {
  try {
    const payload = await getPayload()

    const pages = await payload.find({
      collection: "pages",
      where: {
        _status: {
          equals: "published",
        },
      },
      limit: 100,
    })

    return pages.docs
  } catch (error) {
    console.error("Error fetching all pages:", error)
    return []
  }
}
