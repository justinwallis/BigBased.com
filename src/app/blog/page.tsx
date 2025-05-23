import { getPayload } from "@/lib/payload"

export const dynamic = "force-dynamic"

export default async function BlogPage() {
  const payload = await getPayload()

  const posts = await payload.find({
    collection: "posts",
    where: {
      status: {
        equals: "published",
      },
    },
    sort: "-publishedDate",
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      <div className="grid gap-6">
        {posts.docs.map((post) => (
          <article key={post.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
            {post.excerpt && <p className="text-gray-600 mb-4">{post.excerpt}</p>}
            <div className="text-sm text-gray-500">Published: {new Date(post.publishedDate).toLocaleDateString()}</div>
          </article>
        ))}
      </div>
    </div>
  )
}
