import { getPayload } from "@/lib/getPayload"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  try {
    const payload = await getPayload()

    const posts = await payload.find({
      collection: "posts",
      where: {
        published: {
          equals: true,
        },
      },
      sort: "-publishedDate",
      limit: 10,
    })

    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        {posts.docs.length === 0 ? (
          <p className="text-gray-600">No blog posts found.</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((post) => (
              <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
                <div className="text-sm text-gray-500">
                  {post.publishedDate && new Date(post.publishedDate).toLocaleDateString()}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error fetching blog posts:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-red-600">Error loading blog posts. Please try again later.</p>
      </div>
    )
  }
}
