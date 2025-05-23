import { getPayload } from "../../api/payload/[...payload]/route"
import { notFound } from "next/navigation"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
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
      <article className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
        {post.publishedAt && (
          <p className="text-gray-600 mb-8">Published on {new Date(post.publishedAt).toLocaleDateString()}</p>
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

export async function generateStaticParams() {
  try {
    const payload = await getPayload()
    const posts = await payload.find({
      collection: "posts",
      where: {
        status: {
          equals: "published",
        },
      },
    })

    return posts.docs.map((post: any) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("Error generating static params:", error)
    return []
  }
}
