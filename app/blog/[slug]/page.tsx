import Link from "next/link"
import PayloadContentRenderer from "@/components/payload-content-renderer"

export const dynamic = "force-dynamic"

export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto px-4 py-12">
      <Link href="/blog" className="text-blue-600 hover:text-blue-800 mb-6 inline-block">
        ← Back to Blog
      </Link>

      <article className="max-w-4xl mx-auto">
        <PayloadContentRenderer collection="posts" slug={params.slug} />
      </article>
    </div>
  )
}
