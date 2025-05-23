import { getPayload } from "../api/payload/[...payload]/route"

export default async function BlogPage() {
  const payload = await getPayload()

  try {
    const posts = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-publishedAt",
    })

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.docs.map((post: any) => (
            <article key={post.id} className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
              <a href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                Read more →
              </a>
            </article>
          ))}
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching posts:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p>Unable to load posts at this time.</p>
      </div>
    )
  }
}

export const dynamic = "force-dynamic"
