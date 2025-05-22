import { getPayload } from "./getPayload"

export async function getPage(slug: string) {
  const payload = await getPayload()

  try {
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

    return page.docs[0] || null
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    return null
  }
}

export async function getPosts({
  limit = 10,
  page = 1,
  category = null,
}: {
  limit?: number
  page?: number
  category?: string | null
}) {
  const payload = await getPayload()

  try {
    const where: any = {
      status: {
        equals: "published",
      },
    }

    if (category) {
      where.category = {
        equals: category,
      }
    }

    const posts = await payload.find({
      collection: "posts",
      where,
      limit,
      page,
      sort: "-publishedAt",
    })

    return posts
  } catch (error) {
    console.error("Error fetching posts:", error)
    return { docs: [], totalDocs: 0, totalPages: 0, page: 1, hasNextPage: false, hasPrevPage: false }
  }
}

export async function getPost(slug: string) {
  const payload = await getPayload()

  try {
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
    })

    return post.docs[0] || null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    return null
  }
}
