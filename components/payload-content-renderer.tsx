"use client"

import { useEffect, useState } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

interface PayloadContentRendererProps {
  collection: string
  slug?: string
  id?: string
}

export default function PayloadContentRenderer({ collection, slug, id }: PayloadContentRendererProps) {
  const [content, setContent] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true)
        setError(null)

        let url = `/api/payload/${collection}`

        if (slug) {
          url += `?where[slug][equals]=${slug}`
        } else if (id) {
          url += `/${id}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`)
        }

        const data = await response.json()

        // Handle collection vs single item response
        const contentData = slug ? data.docs[0] : data

        if (!contentData) {
          throw new Error("Content not found")
        }

        setContent(contentData)
      } catch (err) {
        console.error("Error fetching content:", err)
        setError(err instanceof Error ? err.message : "An error occurred while fetching content")
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [collection, slug, id])

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
      </div>
    )
  }

  if (error) {
    return <div className="text-red-600 dark:text-red-400">{error}</div>
  }

  if (!content) {
    return <div className="text-gray-600 dark:text-gray-400">No content found</div>
  }

  // Render the content based on the collection type
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>

      {/* Render rich text content */}
      {content.content && (
        <div className="prose prose-lg dark:prose-invert max-w-none">
          {typeof content.content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          ) : (
            // For Slate-format rich text
            <div>
              {content.content.map((node: any, i: number) => (
                <p key={i}>{node.children?.[0]?.text || ""}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
