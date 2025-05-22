import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getPost } from "../../payload/payload-utils"
import { RichTextRenderer } from "@/components/rich-text-renderer"

export const revalidate = 60 // Revalidate this page every 60 seconds

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Blog
      </Link>

      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

        <div className="flex items-center text-gray-500 mb-8">
          <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
          <span className="mx-2">•</span>
          <span>{post.category}</span>
        </div>

        {post.featuredImage && (
          <div className="relative h-96 w-full mb-8">
            <Image
              src={post.featuredImage.url || "/placeholder.svg"}
              alt={post.featuredImage.alt || post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none">
          <RichTextRenderer content={post.content} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag, index) => (
                <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {tag.tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
