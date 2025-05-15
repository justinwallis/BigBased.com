"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollAnimationProps {
  children: React.ReactNode
  className?: string
  threshold?: number
  delay?: number
  duration?: number
  once?: boolean
  animation?: "fade-up" | "fade-in" | "slide-in-right" | "slide-in-left" | "zoom-in"
}

export default function ScrollAnimation({
  children,
  className,
  threshold = 0.1,
  delay = 0,
  duration = 800,
  once = true,
  animation = "fade-in",
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // If the element is visible and we haven't animated yet (or we're not doing it once)
        if (entry.isIntersecting && (!hasAnimated || !once)) {
          setIsVisible(true)
          if (once) setHasAnimated(true)
        } else if (!once) {
          // If we're not doing it once, we can hide it again
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: "0px", // Trigger a bit before the element is fully in view
      },
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, once, hasAnimated])

  // Define animation styles
  const animationStyles = {
    opacity: isVisible ? 1 : 0,
    transform: isVisible
      ? "translate3d(0, 0, 0)"
      : animation === "fade-up"
        ? "translate3d(0, 30px, 0)"
        : animation === "slide-in-right"
          ? "translate3d(100px, 0, 0)"
          : animation === "slide-in-left"
            ? "translate3d(-100px, 0, 0)"
            : animation === "zoom-in"
              ? "scale(0.9)"
              : "translate3d(0, 0, 0)",
    transition: `opacity ${duration}ms ease-out ${delay}ms, transform ${duration}ms ease-out ${delay}ms`,
  }

  return (
    <div ref={ref} className={cn(className)} style={animationStyles}>
      {children}
    </div>
  )
}
