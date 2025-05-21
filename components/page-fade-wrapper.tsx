"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export function PageFadeWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Apply fade-in effect when the route changes
  useEffect(() => {
    if (wrapperRef.current) {
      // Reset the animation by removing and re-adding the class
      wrapperRef.current.classList.remove("animate-fade-in")
      void wrapperRef.current.offsetWidth // Force reflow
      wrapperRef.current.classList.add("animate-fade-in")
    }
  }, [pathname, searchParams])

  return (
    <div
      ref={wrapperRef}
      className="animate-fade-in"
      style={{
        animation: "fadeIn 0.6s ease-out forwards",
        opacity: 0,
      }}
    >
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {children}
    </div>
  )
}
