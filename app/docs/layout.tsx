import type React from "react"
import type { Metadata } from "next"
import { Suspense } from "react"
import { getDocumentationCategories } from "@/app/actions/documentation-actions"
import DocsClientLayout from "./DocsClientLayout"

export const metadata: Metadata = {
  title: "Documentation | Big Based",
  description: "Learn how to use the Big Based platform with our comprehensive documentation.",
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const categories = await getDocumentationCategories()

  return (
    <DocsClientLayout
      categories={categories}
      children={<Suspense fallback={<div className="p-8">Loading...</div>}>{children}</Suspense>}
    />
  )
}
