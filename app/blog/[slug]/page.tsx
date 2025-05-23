import CMSContent from "@/components/cms-content"

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return (
    <div className="container mx-auto py-8 px-4">
      <CMSContent collection="posts" slug={params.slug} />
    </div>
  )
}

export const dynamic = "force-dynamic"
