import { getPayload } from "../app/payload/getPayload"

export async function getPages(options: { limit?: number; page?: number; where?: any } = {}) {
  const payload = await getPayload()

  const { docs, hasNextPage, hasPrevPage, nextPage, prevPage, totalDocs, totalPages } = await payload.find({
    collection: "pages",
    limit: options.limit || 10,
    page: options.page || 1,
    where: options.where || { status: { equals: "published" } },
  })

  return {
    docs,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalDocs,
    totalPages,
  }
}

export async function getPageBySlug(slug: string) {
  const payload = await getPayload()

  try {
    const page = await payload.find({
      collection: "pages",
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: "published" } }],
      },
    })

    return page.docs[0] || null
  } catch (error) {
    console.error(`Error fetching page with slug ${slug}:`, error)
    return null
  }
}

export async function getPosts(options: { limit?: number; page?: number; where?: any } = {}) {
  const payload = await getPayload()

  const { docs, hasNextPage, hasPrevPage, nextPage, prevPage, totalDocs, totalPages } = await payload.find({
    collection: "posts",
    limit: options.limit || 10,
    page: options.page || 1,
    where: options.where || { status: { equals: "published" } },
  })

  return {
    docs,
    hasNextPage,
    hasPrevPage,
    nextPage,
    prevPage,
    totalDocs,
    totalPages,
  }
}

export async function getPostBySlug(slug: string) {
  const payload = await getPayload()

  try {
    const post = await payload.find({
      collection: "posts",
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: "published" } }],
      },
    })

    return post.docs[0] || null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    return null
  }
}
