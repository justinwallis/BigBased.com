"use client"

import { Moon, Sun } from "lucide-react"
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

  return (
    <button
      onClick={toggleTheme}
      className={`${className} ${
        variant === "button"
          ? "flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-800 dark:text-white"
          : "p-1 hover:opacity-80 transition-opacity"
      }`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <>
          <Sun className="h-4 w-4 text-white" />
          {variant === "button" && <span className="text-gray-800 dark:text-white">Light mode</span>}
        </>
      ) : (
        <>
          <Moon className="h-5 w-5 text-gray-800" />
          {variant === "button" && <span className="text-gray-800 dark:text-white">Dark mode</span>}
        </>
      )}
    </button>
  )
}
