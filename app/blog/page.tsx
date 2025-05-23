import { getPosts } from "../../lib/payload-api"
import Link from "next/link"
import Image from "next/image"

export default async function BlogPage() {
  const { docs: posts } = await getPosts()

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 group-hover:shadow-lg">
                {post.featuredImage && (
                  <div className="relative h-48 w-full">
                    <Image
                      src={post.featuredImage.url || "/placeholder.svg"}
                      alt={post.featuredImage.alt || post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-2 group-hover:text-blue-600">{post.title}</h2>
                  {post.publishedDate && (
                    <p className="text-sm text-gray-600 mb-2">{new Date(post.publishedDate).toLocaleDateString()}</p>
                  )}
                  <div className="text-gray-700 line-clamp-3">
                    {/* This would need proper rich text rendering in a real app */}
                    {post.content && typeof post.content === "string"
                      ? post.content.substring(0, 150) + "..."
                      : "Read more..."}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <h2 className="text-2xl font-semibold mb-4">No posts found</h2>
            <p className="text-gray-600">Check back later for new content!</p>
          </div>
        )}
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
