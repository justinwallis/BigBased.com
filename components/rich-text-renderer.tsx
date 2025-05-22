"use client"
import escapeHTML from "escape-html"
import Link from "next/link"
import Image from "next/image"

// This is a simplified rich text renderer
// You may want to expand this based on your specific needs
export const RichTextRenderer = ({ content }: { content: any }) => {
  if (!content) {
    return null
  }

  // For safety, if content is passed as a string (like JSON.stringify(content))
  if (typeof content === "string") {
    try {
      content = JSON.parse(content)
    } catch (e) {
      return <div dangerouslySetInnerHTML={{ __html: escapeHTML(content) }} />
    }
  }

  // If content is not an array (Slate format), return as is
  if (!Array.isArray(content)) {
    return <div>{String(content)}</div>
  }

  return (
    <div className="rich-text">
      {content.map((node, i) => {
        return <RenderNode key={i} node={node} />
      })}
    </div>
  )
}

const RenderNode = ({ node }: { node: any }) => {
  if (typeof node === "string") {
    return <span>{node}</span>
  }

  if (!node) {
    return null
  }

  const { type, value, children, url, alt, ...rest } = node

  switch (type) {
    case "h1":
      return (
        <h1 className="text-4xl font-bold my-6">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </h1>
      )
    case "h2":
      return (
        <h2 className="text-3xl font-bold my-5">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </h2>
      )
    case "h3":
      return (
        <h3 className="text-2xl font-bold my-4">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </h3>
      )
    case "h4":
      return (
        <h4 className="text-xl font-bold my-4">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </h4>
      )
    case "h5":
      return (
        <h5 className="text-lg font-bold my-3">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </h5>
      )
    case "h6":
      return (
        <h6 className="text-base font-bold my-3">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </h6>
      )
    case "quote":
      return (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </blockquote>
      )
    case "ul":
      return (
        <ul className="list-disc pl-6 my-4">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </ul>
      )
    case "ol":
      return (
        <ol className="list-decimal pl-6 my-4">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </ol>
      )
    case "li":
      return (
        <li className="my-1">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </li>
      )
    case "link":
      const isExternal = url?.startsWith("http")
      return isExternal ? (
        <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </a>
      ) : (
        <Link href={url} className="text-blue-600 hover:underline">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </Link>
      )
    case "upload":
      return (
        <div className="my-4">
          <Image src={url || "/placeholder.svg"} alt={alt || ""} width={800} height={600} className="rounded-lg" />
          {alt && <p className="text-sm text-gray-500 mt-2">{alt}</p>}
        </div>
      )
    default:
      return (
        <p className="my-3">
          {children?.map((child: any, i: number) => (
            <RenderNode key={i} node={child} />
          ))}
        </p>
      )
  }
}
