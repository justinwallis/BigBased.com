"use client"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface CMSContentProps {
  content: any
  type: "page" | "post"
}

export default function CMSContent({ content, type }: CMSContentProps) {
  const router = useRouter()

  if (!content) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Content not found</h2>
        <button onClick={() => router.back()} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go Back
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{content.title}</h1>

      {type === "post" && content.author && (
        <div className="mb-4 text-gray-600">
          By {content.author.name || content.author.email}
          {content.publishedDate && <span> • {new Date(content.publishedDate).toLocaleDateString()}</span>}
        </div>
      )}

      {content.featuredImage && (
        <div className="mb-6 relative h-64 w-full">
          <Image
            src={content.featuredImage.url || "/placeholder.svg"}
            alt={content.featuredImage.alt || content.title}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      )}

      <div className="prose max-w-none">
        {/* This is a simplified version - in a real app, you'd need to render the rich text content properly */}
        <div dangerouslySetInnerHTML={{ __html: content.content }} />
      </div>
    </div>
  )
}
