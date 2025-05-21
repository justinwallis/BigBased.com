"use client"

import type React from "react"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MatrixPageTransition } from "./matrix-page-transition"

interface MatrixLinkProps {
  href: string
  className?: string
  children: React.ReactNode
}

export function MatrixLink({ href, className, children }: MatrixLinkProps) {
  const router = useRouter()
  const [isTransitioning, setIsTransitioning] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Skip transition for auth pages
  const isAuthPage = href.startsWith("/auth") || window.location.pathname.startsWith("/auth")

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      // Skip for auth pages or external links
      if (isAuthPage || href.startsWith("http") || href.startsWith("#")) {
        return
      }

      e.preventDefault()
      setIsTransitioning(true)

      // Navigate after transition completes
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      timeoutRef.current = setTimeout(() => {
        router.push(href)
      }, 2500) // Slightly longer than the transition duration
    },
    [href, isAuthPage, router],
  )

  const handleTransitionComplete = useCallback(() => {
    setIsTransitioning(false)
  }, [])

  // For auth pages or external links, use regular Link
  if (isAuthPage || href.startsWith("http") || href.startsWith("#")) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    )
  }

  return (
    <>
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
      {isTransitioning && <MatrixPageTransition onTransitionComplete={handleTransitionComplete} />}
    </>
  )
}
