import { getPosts } from "@/lib/payload-api"
import Link from "next/link"

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-sm">
            {post.featuredImage && (
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={post.featuredImage.url || "/placeholder.svg"}
                  alt={post.featuredImage.alt || post.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-4">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-sm text-gray-500 mb-4">{new Date(post.publishedDate).toLocaleDateString()}</p>
              <Link href={`/blog/${post.slug}`} className="text-blue-600 hover:underline">
                Read more →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
