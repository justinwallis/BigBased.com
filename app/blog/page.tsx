import CMSContent from "@/components/cms-content"

export default function BlogPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <CMSContent collection="posts" />
    </div>
  )
}

export const dynamic = "force-dynamic"
