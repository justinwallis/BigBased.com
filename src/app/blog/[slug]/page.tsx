import { getPayload } from "../../api/payload/[...payload]/lib/payload"
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
        status: {
          equals: "published",
        },
      },
      limit: 1,
    })

    if (!posts.docs.length) {
      notFound()
    }

    const post = posts.docs[0]

    return (
      <article className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="text-gray-600">Published: {new Date(post.createdAt).toLocaleDateString()}</div>
        </header>

        {post.excerpt && <div className="text-xl text-gray-700 mb-8 italic">{post.excerpt}</div>}

        <div className="prose max-w-none">
          {post.content && <div dangerouslySetInnerHTML={{ __html: post.content }} />}
        </div>
      </article>
    )
  } catch (error) {
    console.error("Error fetching post:", error)
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Post Not Found</h1>
        <p>Error loading post. Please try again later.</p>
      </div>
    )
  }
}
