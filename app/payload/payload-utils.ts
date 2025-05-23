import { getPayload } from "./getPayload"

export async function getPage(slug: string) {
  try {
    const payload = await getPayload()

    const pages = await payload.find({
      collection: "pages",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return pages.docs[0] || null
  } catch (error) {
    console.error("Error fetching page:", error)
    return null
  }
}

export async function getAllPages() {
  try {
    const payload = await getPayload()

    const pages = await payload.find({
      collection: "pages",
      limit: 100,
    })

    return pages.docs
  } catch (error) {
    console.error("Error fetching pages:", error)
    return []
  }
}

export async function getPost(slug: string) {
  try {
    const payload = await getPayload()

    const posts = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    return posts.docs[0] || null
  } catch (error) {
    console.error("Error fetching post:", error)
    return null
  }
}

export async function getAllPosts() {
  try {
    const payload = await getPayload()

    const posts = await payload.find({
      collection: "posts",
      limit: 100,
    })

    return posts.docs
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}
