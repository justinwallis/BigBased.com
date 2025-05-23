import { getPayload } from "../../lib/payload"
import { notFound } from "next/navigation"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const payload = await getPayload()

  try {
    const posts = await payload.find({
      collection: "posts",
      where: {
        slug: {
          equals: params.slug,
        },
        status: {
          equals: "published",
        },
      },
      limit: 1,
    })

    if (posts.docs.length === 0) {
      notFound()
    }

    const post = posts.docs[0]

    return (
      <article className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.publishedDate && (
          <time className="text-gray-500 mb-8 block">{new Date(post.publishedDate).toLocaleDateString()}</time>
        )}
        {post.content && (
          <div className="prose max-w-none">
            {/* Render rich text content here */}
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        )}
      </article>
    )
  } catch (error) {
    console.error("Error fetching post:", error)
    notFound()
  }
}

export const dynamic = "force-dynamic"
