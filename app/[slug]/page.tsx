import { notFound } from "next/navigation"
import { getPage } from "../payload/payload-utils"
import { RichTextRenderer } from "@/components/rich-text-renderer"

// Don't generate static params during build
export async function generateStaticParams() {
  return []
}

// Make this page dynamic
export const dynamic = "force-dynamic"

export default async function CMSPage({ params }: { params: { slug: string } }) {
  // Don't try to fetch for the homepage or known routes
  if (params.slug === "" || params.slug === "admin" || params.slug === "api") {
    notFound()
  }

  try {
    const page = await getPage(params.slug)

    if (!page) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-12">
        <article className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">{page.title}</h1>

          <div className="prose prose-lg max-w-none">
            <RichTextRenderer content={page.content} />
          </div>
        </article>
      </div>
    )
  } catch (error) {
    console.error("Error loading page:", error)
    notFound()
  }
}
