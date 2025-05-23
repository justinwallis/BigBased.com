import { getPayload } from "../api/payload/[...payload]/lib/payload"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  try {
    const payload = await getPayload()
    const posts = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
      sort: "-createdAt",
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
              <div className="text-sm text-gray-500">Published: {new Date(post.createdAt).toLocaleDateString()}</div>
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
        <p>Error loading posts. Please try again later.</p>
      </div>
    )
  }
}
