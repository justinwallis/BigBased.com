import { getPostBySlug } from "@/lib/payload-api"
import CMSContent from "@/components/cms-content"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 hover:underline mb-6 inline-block">
        ← Back to all posts
      </Link>

      {post.featuredImage && (
        <div className="aspect-video w-full max-w-4xl mx-auto mb-8 overflow-hidden rounded-lg">
          <img
            src={post.featuredImage.url || "/placeholder.svg"}
            alt={post.featuredImage.alt || post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <CMSContent content={post} />

        <div className="mt-8 text-sm text-gray-500">
          <p>Published on {new Date(post.publishedDate).toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
