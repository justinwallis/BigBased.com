import { getPayload } from "@/lib/getPayload"
import { notFound } from "next/navigation"

export const dynamic = "force-dynamic"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  try {
    const payload = await getPayload()

    const posts = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: params.slug,
        },
        published: {
          equals: true,
        },
      },
      limit: 1,
    })

    if (posts.docs.length === 0) {
      notFound()
    }

    const post = posts.docs[0]

    return (
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          {post.publishedDate && (
            <time className="text-gray-600">{new Date(post.publishedDate).toLocaleDateString()}</time>
          )}
        </header>

        {post.content && (
          <div className="prose prose-lg max-w-none">
            {/* You'll need to render the rich text content here */}
            <div dangerouslySetInnerHTML={{ __html: JSON.stringify(post.content) }} />
          </div>
        )}
      </article>
    )
  } catch (error) {
    console.error("Error fetching blog post:", error)
    notFound()
  }
}
