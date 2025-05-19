"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbProps {
  className?: string
  separator?: React.ReactNode
  homeLabel?: string
  maxItems?: number
  variant?: "default" | "compact" | "minimal"
}

export default function Breadcrumb({
  className,
  separator = <ChevronRight className="h-3 w-3 mx-1 flex-shrink-0 opacity-50" />,
  homeLabel = "Home",
  maxItems = 3,
  variant = "default",
}: BreadcrumbProps) {
  const pathname = usePathname()

  // Skip rendering breadcrumbs on the homepage
  if (pathname === "/") return null

  // Split the pathname into segments and decode them
  const segments = pathname
    .split("/")
    .filter(Boolean)
    .map((segment) => decodeURIComponent(segment))

  // For compact variant, only show the last segment
  if (variant === "compact" && segments.length > 0) {
    return (
      <div className={cn("text-xs flex items-center", className)}>
        <span className="opacity-50">{homeLabel} / </span>
        <span className="font-medium">{formatSegment(segments[segments.length - 1])}</span>
      </div>
    )
  }

  // For minimal variant, just show the current page name
  if (variant === "minimal" && segments.length > 0) {
    return (
      <div className={cn("text-xs", className)}>
        <span className="font-medium">{formatSegment(segments[segments.length - 1])}</span>
      </div>
    )
  }

  // If there are too many segments, truncate the middle ones
  let displaySegments = [...segments]
  if (segments.length > maxItems) {
    const firstItem = segments[0]
    const lastItems = segments.slice(-2) // Keep last 2 items
    displaySegments = [firstItem, "...", ...lastItems]
  }

  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs flex items-center flex-wrap", className)}>
      <ol className="flex items-center flex-wrap">
        <li className="flex items-center">
          <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
            {homeLabel}
          </Link>
        </li>

        {displaySegments.map((segment, index) => {
          // Skip rendering a link for the ellipsis
          if (segment === "...") {
            return (
              <li key="ellipsis" className="flex items-center">
                {separator}
                <span className="opacity-60">...</span>
              </li>
            )
          }

          // Build the href for this segment
          const href = "/" + segments.slice(0, segments.indexOf(segment) + 1).join("/")

          return (
            <li key={segment} className="flex items-center">
              {separator}
              {index === displaySegments.length - 1 ? (
                <span className="font-medium">{formatSegment(segment)}</span>
              ) : (
                <Link href={href} className="opacity-60 hover:opacity-100 transition-opacity">
                  {formatSegment(segment)}
                </Link>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// Helper function to format segment names
function formatSegment(segment: string): string {
  // Replace hyphens with spaces and capitalize each word
  return segment
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
