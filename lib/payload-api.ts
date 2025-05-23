import { getPayload } from "@/app/payload/getPayload"

export async function getCollection(collection: string, query: any = {}) {
  const payload = await getPayload()

  try {
    const result = await payload.find({
      collection,
      ...query,
    })

    return result
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error)
    throw error
  }
}

export async function getDocument(collection: string, slug: string) {
  const payload = await getPayload()

  try {
    const result = await payload.find({
      collection,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    if (result.docs.length === 0) {
      return null
    }

    return result.docs[0]
  } catch (error) {
    console.error(`Error fetching ${collection} document:`, error)
    throw error
  }
}
