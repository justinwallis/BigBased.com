import { notFound } from "next/navigation"
import { getContentItem } from "@/app/actions/cms-actions"
import LivePreviewClient from "./live-preview-client"

interface PreviewPageProps {
  params: {
    id: string
  }
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const result = await getContentItem(params.id)

  if (!result.success || !result.data) {
    notFound()
  }

  return <LivePreviewClient contentItem={result.data} />
}
