import { notFound } from "next/navigation"
import { getPage } from "../payload/payload-utils"
import { RichTextRenderer } from "@/components/rich-text-renderer"

export const revalidate = 60 // Revalidate this page every 60 seconds

// Generate static params for known pages
export async function generateStaticParams() {
  // You could fetch all published pages here
  return [{ slug: "about-us" }, { slug: "contact" }, { slug: "terms" }, { slug: "privacy" }]
}

export default async function CMSPage({ params }: { params: { slug: string } }) {
  // Don't try to fetch for the homepage
  if (params.slug === "") {
    notFound()
  }

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
}
