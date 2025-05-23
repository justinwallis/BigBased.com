import { notFound } from "next/navigation"
import PayloadContentRenderer from "@/components/payload-content-renderer"

export const dynamic = "force-dynamic"

export default async function CMSPage({ params }: { params: { slug: string } }) {
  // Skip for the homepage
  if (params.slug === "") {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <article className="max-w-4xl mx-auto">
        <PayloadContentRenderer collection="pages" slug={params.slug} />
      </article>
    </div>
  )
}
