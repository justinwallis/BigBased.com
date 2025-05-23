// Utility functions for fetching data from Payload CMS

export async function getPages() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payload/pages`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch pages")
  }

  const data = await res.json()
  return data.docs
}

export async function getPageBySlug(slug: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payload/pages?where[slug][equals]=${slug}`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch page")
  }

  const data = await res.json()
  return data.docs[0]
}

export async function getPosts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/payload/posts?where[status][equals]=published`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Failed to fetch posts")
  }

  const data = await res.json()
  return data.docs
}

export async function getPostBySlug(slug: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/payload/posts?where[slug][equals]=${slug}&where[status][equals]=published`,
    { cache: "no-store" },
  )

  if (!res.ok) {
    throw new Error("Failed to fetch post")
  }

  const data = await res.json()
  return data.docs[0]
}
