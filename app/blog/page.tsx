import Link from "next/link"
import Image from "next/image"
import { getPosts } from "../payload/payload-utils"

export const revalidate = 60 // Revalidate this page every 60 seconds

export default async function BlogPage() {
  const posts = await getPosts({ limit: 10 })

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.docs.length > 0 ? (
          posts.docs.map((post) => (
            <div key={post.id} className="border rounded-lg overflow-hidden shadow-md">
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
                <p className="text-sm text-gray-500 mb-2">
                  {new Date(post.publishedAt).toLocaleDateString()} • {post.category}
                </p>
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:text-blue-800 font-medium">
                  Read More →
                </Link>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-xl text-gray-500">No posts found</p>
          </div>
        )}
      </div>

      {posts.totalPages > 1 && (
        <div className="flex justify-center mt-8">
          {Array.from({ length: posts.totalPages }).map((_, i) => (
            <Link
              key={i}
              href={`/blog?page=${i + 1}`}
              className={`mx-1 px-4 py-2 rounded ${
                posts.page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
