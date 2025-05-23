import { notFound } from "next/navigation"
import { getPostBySlug } from "../../../lib/payload"

// Force dynamic rendering for this page
export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  // Fetch the post by slug
  const post = await getPostBySlug(params.slug)

  // If post not found, return 404
  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {post.featuredImage && (
        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src={post.featuredImage.url || "/placeholder.svg"}
            alt={post.featuredImage.alt}
            className="w-full h-auto"
          />
          {post.featuredImage.caption && (
            <p className="text-sm text-gray-500 mt-2 italic text-center">{post.featuredImage.caption}</p>
          )}
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

      <div className="flex items-center text-gray-600 mb-8">
        <span>
          {new Date(post.publishedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span className="mx-2">•</span>
        <span>{post.category}</span>
        {post.author && (
          <>
            <span className="mx-2">•</span>
            <span>By {post.author.name || post.author.email}</span>
          </>
        )}
      </div>

      <div className="prose prose-lg max-w-none">
        {/* This is a simplified rendering of content - in a real app, you'd use a rich text renderer */}
        <div dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }} />
      </div>
    </div>
  )
}
