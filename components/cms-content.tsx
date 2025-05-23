"use client"

import { useEffect, useState } from "react"

interface CMSContentProps {
  collection: string
  slug?: string
}

export default function CMSContent({ collection, slug }: CMSContentProps) {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `/api/${collection}`
        if (slug) {
          url = `${url}?where[slug][equals]=${slug}`
        }

        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.statusText}`)
        }

        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [collection, slug])

  if (loading) {
    return <div className="animate-pulse p-4 bg-gray-100 rounded-md">Loading content...</div>
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded-md">Error: {error}</div>
  }

  if (!data || !data.docs || data.docs.length === 0) {
    return <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">No content found</div>
  }

  // For collections, show a list
  if (!slug) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">{collection.charAt(0).toUpperCase() + collection.slice(1)}</h2>
        <ul className="space-y-2">
          {data.docs.map((item: any) => (
            <li key={item.id} className="p-4 bg-white shadow rounded-md">
              <h3 className="text-xl font-semibold">{item.title}</h3>
              {item.publishedDate && (
                <p className="text-sm text-gray-500">{new Date(item.publishedDate).toLocaleDateString()}</p>
              )}
              {item.status && <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.status}</span>}
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // For a single item, show its details
  const item = data.docs[0]

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold">{item.title}</h1>
      {item.publishedDate && (
        <p className="text-sm text-gray-500">{new Date(item.publishedDate).toLocaleDateString()}</p>
      )}
      {item.status && <span className="text-xs bg-gray-200 px-2 py-1 rounded">{item.status}</span>}

      {item.content && <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: item.content }} />}
    </div>
  )
}
