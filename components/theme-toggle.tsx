"use client"
import { useTheme } from "next-themes"
import { useState, useEffect } from "react"

interface ThemeToggleProps {
  variant?: "icon" | "button"
  className?: string
}

export function ThemeToggle({ variant = "icon", className = "" }: ThemeToggleProps) {
  const { theme, setTheme, systemTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // More robust theme detection for mobile
  const getEffectiveTheme = () => {
    if (!mounted) {
      // Before mounting, check system preference
      if (typeof window !== "undefined") {
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      }
      return "light"
    }

    // After mounting, use the theme provider's logic
    const effectiveTheme = theme === "system" ? systemTheme : theme
    return effectiveTheme
  }

  const isDark = getEffectiveTheme() === "dark"

  return null
}
