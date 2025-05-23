import { getPostBySlug } from "../../../lib/payload-api"
import { notFound } from "next/navigation"
import CMSContent from "../../../components/cms-content"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    notFound()
  }

  return <CMSContent content={post} type="post" />
}

export const dynamic = "force-dynamic"
