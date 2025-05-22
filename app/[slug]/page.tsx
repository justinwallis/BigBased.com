import { notFound } from "next/navigation"
import { getPageBySlug } from "@/lib/cms"

export const dynamic = "force-dynamic"

export default async function CMSPage({ params }: { params: { slug: string } }) {
  // Skip for the homepage
  if (params.slug === "") {
    notFound()
  }

  const page = await getPageBySlug(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

        <div className="prose prose-lg max-w-none dark:prose-invert">
          {/* For now, we'll just render the content as HTML */}
          {/* In a real app, you'd want to use a rich text renderer */}
          <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>
      </article>
    </div>
  )
}
