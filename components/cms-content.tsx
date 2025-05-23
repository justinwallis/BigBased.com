"use client"

interface CMSContentProps {
  content: any
}

export default function CMSContent({ content }: CMSContentProps) {
  if (!content) {
    return <div>No content available</div>
  }

  // This is a simple implementation - in a real app, you'd want to use a proper rich text renderer
  return (
    <div className="cms-content">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      <div className="prose max-w-none">
        {/* This is a simplified approach - you'd want to use a proper rich text renderer */}
        {typeof content.content === "string" ? (
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        ) : (
          <pre>{JSON.stringify(content.content, null, 2)}</pre>
        )}
      </div>
    </div>
  )
}
