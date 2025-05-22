import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { getPostBySlug } from "@/lib/cms"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

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
          <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>

          {post.categories && post.categories.length > 0 && (
            <>
              <span className="mx-2">•</span>
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded dark:bg-blue-900 dark:text-blue-100">
                {post.categories[0].name}
              </span>
            </>
          )}
        </div>

        {post.featured_image && (
          <div className="relative h-96 w-full mb-8">
            <Image
              src={post.featured_image || "/placeholder.svg"}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>
        )}

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* For now, we'll just render the content as HTML */}
          {/* In a real app, you'd want to use a rich text renderer */}
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {post.categories && post.categories.length > 0 && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-2">Categories:</h3>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/blog/category/${category.slug}`}
                  className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}
