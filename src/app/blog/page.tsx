import { getPayload } from "../lib/payload"

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
      sort: "-publishedDate",
    })

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <div className="grid gap-6">
          {posts.docs.map((post: any) => (
            <article key={post.id} className="border rounded-lg p-6">
              <h2 className="text-2xl font-semibold mb-2">
                <a href={`/blog/${post.slug}`} className="hover:text-blue-600">
                  {post.title}
                </a>
              </h2>
              {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
              {post.publishedDate && (
                <time className="text-sm text-gray-500">{new Date(post.publishedDate).toLocaleDateString()}</time>
              )}
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
