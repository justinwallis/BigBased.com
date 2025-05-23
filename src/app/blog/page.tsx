import Link from "next/link"
import { getPosts } from "../../lib/payload"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default async function BlogPage() {
  // Fetch posts from Payload CMS
  const { posts } = await getPosts()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {post.featuredImage && (
                <div className="h-48 overflow-hidden">
                  <img
                    src={post.featuredImage.url || "/placeholder.svg"}
                    alt={post.featuredImage.alt}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">{post.meta?.description || "No description available"}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">{new Date(post.publishedDate).toLocaleDateString()}</span>
                  <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h3 className="text-xl font-medium mb-2">No posts found</h3>
            <p className="text-gray-600">Check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  )
}
