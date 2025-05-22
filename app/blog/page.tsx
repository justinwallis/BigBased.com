import Link from "next/link"
import { getPosts } from "../payload/payload-utils"

// Make this page dynamic
export const dynamic = "force-dynamic"

export default async function BlogPage() {
  try {
    const posts = await getPosts()

    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>

        {posts.docs.length === 0 ? (
          <p className="text-gray-600">No blog posts available yet.</p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.docs.map((post: any) => (
              <article key={post.id} className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  {post.category && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{post.category}</span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error("Error loading blog posts:", error)
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Blog</h1>
        <p className="text-gray-600">Unable to load blog posts at this time.</p>
      </div>
    )
  }
}
