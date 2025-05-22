import { notFound } from "next/navigation"
import { getPost } from "../../payload/payload-utils"
import { RichTextRenderer } from "@/components/rich-text-renderer"

// Don't generate static params during build
export async function generateStaticParams() {
  return []
}

// Make this page dynamic
export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  try {
    const post = await getPost(params.slug)

    if (!post) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-8 text-gray-600">
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            {post.category && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{post.category}</span>
            )}
          </div>

          {post.excerpt && <p className="text-xl text-gray-600 mb-8">{post.excerpt}</p>}

          <div className="prose prose-lg max-w-none">
            <RichTextRenderer content={post.content} />
          </div>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold mb-2">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string, index: number) => (
                  <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    )
  } catch (error) {
    console.error("Error loading blog post:", error)
    notFound()
  }
}
