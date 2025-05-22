import Link from "next/link"
import Image from "next/image"
import { getPublishedPosts } from "@/lib/cms"

export const dynamic = "force-dynamic"

export default async function BlogPage({
  searchParams,
}: {
  searchParams: { page?: string }
}) {
  const page = searchParams.page ? Number.parseInt(searchParams.page) : 1
  const { posts, count } = await getPublishedPosts(10, page)
  const totalPages = Math.ceil(count / 10)

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600 dark:text-gray-300">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              {post.featured_image && (
                <div className="relative h-48 w-full">
                  <Image
                    src={post.featured_image || "/placeholder.svg"}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                    {post.title}
                  </Link>
                </h2>

                {post.excerpt && <p className="text-gray-600 dark:text-gray-300 mb-4">{post.excerpt}</p>}

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>

                  {post.categories && post.categories.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                      {post.categories[0].name}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="inline-flex">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/blog?page=${i + 1}`}
                className={`px-4 py-2 text-sm ${
                  page === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                } border`}
              >
                {i + 1}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
