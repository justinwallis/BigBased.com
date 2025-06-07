import { notFound } from "next/navigation"
import { getContentItem, getContentTypes } from "@/app/actions/cms-actions"
import ContentEditorClient from "./content-editor-client"

export default async function ContentEditorPage({ params }: { params: { id: string } }) {
  const isNewContent = params.id === "new"

  let contentItem = null
  let contentTypes = []

  // Fetch content types
  const contentTypesResult = await getContentTypes()
  if (contentTypesResult.success) {
    contentTypes = contentTypesResult.data
  }

  // If editing existing content, fetch the content item
  if (!isNewContent) {
    const contentItemResult = await getContentItem(params.id)
    if (!contentItemResult.success || !contentItemResult.data) {
      notFound()
    }
    contentItem = contentItemResult.data
  }

  return <ContentEditorClient contentItem={contentItem} contentTypes={contentTypes} isNew={isNewContent} />
}
