"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Search, X, TrendingUp, Layout, FileText, Layers, GitBranch, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { useTheme } from "@/components/theme-provider"

type SearchPopupProps = {
  isOpen: boolean
  onClose: () => void
}

type CategoryType = {
  id: string
  name: string
  icon: React.ReactNode
}

type AppType = {
  id: string
  name: string
  icon: string
  href: string
}

type ScreenType = {
  id: string
  name: string
  image: string
  href: string
}

const categories: CategoryType[] = [
  { id: "trending", name: "Trending", icon: <TrendingUp className="h-5 w-5" /> },
  { id: "screens", name: "Screens", icon: <Layout className="h-5 w-5" /> },
  { id: "pages", name: "Content Pages", icon: <FileText className="h-5 w-5" /> },
  { id: "ui", name: "UI Elements", icon: <Layers className="h-5 w-5" /> },
  { id: "flows", name: "User Flows", icon: <GitBranch className="h-5 w-5" /> },
  { id: "about", name: "About Big Based", icon: <Info className="h-5 w-5" /> },
]

const apps: AppType[] = [
  { id: "1", name: "Digital Library", icon: "/digital-library.png", href: "/features/library" },
  { id: "2", name: "Community", icon: "/diverse-community-gathering.png", href: "/features/community" },
  { id: "3", name: "Resources", icon: "/resource-toolkit.png", href: "/features/resources" },
  { id: "4", name: "Revolution", icon: "/revolution-background.png", href: "/revolution" },
  { id: "5", name: "Partners", icon: "/partnership-hands.png", href: "/partners" },
  { id: "6", name: "Transform", icon: "/abstract-digital-landscape.png", href: "/transform" },
]

const screens: ScreenType[] = [
  { id: "1", name: "Home", image: "/website-preview.png", href: "/" },
  { id: "2", name: "About", image: "/mission-statement-document.png", href: "/about" },
  { id: "3", name: "Features", image: "/digital-library.png", href: "/features" },
  { id: "4", name: "Contact", image: "/diverse-group.png", href: "/contact" },
  { id: "5", name: "Profile", image: "/abstract-profile.png", href: "/profile" },
  { id: "6", name: "FAQ", image: "/resource-toolkit.png", href: "/faq" },
]

const pages: ScreenType[] = [
  { id: "1", name: "Mission", image: "/mission-statement-document.png", href: "/about/mission" },
  { id: "2", name: "Team", image: "/team-of-professionals.png", href: "/about/team" },
  { id: "3", name: "History", image: "/historical-timeline.png", href: "/about/history" },
  { id: "4", name: "Manifesto", image: "/manifesto-document.png", href: "/revolution/manifesto" },
]

export default function SearchPopup({ isOpen, onClose }: SearchPopupProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("trending")
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { theme } = useTheme()
  const isDarkMode = theme === "dark"

  // Focus the search input when the popup opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleEsc)
    return () => window.removeEventListener("keydown", handleEsc)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={cn("absolute inset-0 backdrop-blur-sm", isDarkMode ? "bg-black/70" : "bg-gray-500/30")}
        onClick={onClose}
      />

      {/* Search Popup */}
      <div
        className={cn(
          "relative w-full max-w-4xl max-h-[85vh] rounded-lg shadow-2xl overflow-hidden",
          isDarkMode ? "bg-gray-900" : "bg-white",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {/* Sidebar */}
          <div
            className={cn(
              "w-64 p-4 border-r",
              isDarkMode ? "bg-gray-900 border-gray-800" : "bg-gray-50 border-gray-200",
            )}
          >
            <div className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={cn(
                    "flex items-center w-full px-4 py-2 rounded-md text-left transition-colors",
                    selectedCategory === category.id
                      ? isDarkMode
                        ? "bg-gray-800 text-white"
                        : "bg-gray-200 text-gray-900"
                      : isDarkMode
                        ? "text-gray-400 hover:bg-gray-800 hover:text-white"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                  )}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  <span className="mr-3">{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto">
            {/* Search Bar */}
            <div
              className={cn(
                "p-4 border-b sticky top-0 z-10",
                isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200",
              )}
            >
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-3 top-1/2 transform -translate-y-1/2",
                    isDarkMode ? "text-gray-400" : "text-gray-500",
                  )}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search Big Based..."
                  className={cn(
                    "w-full pl-10 pr-4 py-2 rounded-full focus:outline-none focus:ring-2",
                    isDarkMode
                      ? "bg-gray-800 text-white focus:ring-blue-500"
                      : "bg-gray-100 text-gray-900 focus:ring-blue-400",
                  )}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className={cn(
                    "absolute right-3 top-1/2 transform -translate-y-1/2",
                    isDarkMode ? "text-gray-400 hover:text-white" : "text-gray-500 hover:text-gray-900",
                  )}
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Content Sections */}
            <div className={cn("p-6", isDarkMode ? "bg-gray-900" : "bg-white")}>
              {/* Apps Section */}
              <div className="mb-8">
                <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Features
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                  {apps.map((app) => (
                    <Link
                      key={app.id}
                      href={app.href}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg transition-colors",
                        isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-100",
                      )}
                      onClick={onClose}
                    >
                      <div className="relative w-12 h-12 mb-2 rounded-lg overflow-hidden">
                        <Image src={app.icon || "/placeholder.svg"} alt={app.name} fill className="object-cover" />
                      </div>
                      <span className={cn("text-xs text-center", isDarkMode ? "text-white" : "text-gray-900")}>
                        {app.name}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Screens Section */}
              <div className="mb-8">
                <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Screens
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {screens.map((screen) => (
                    <Link key={screen.id} href={screen.href} className="group" onClick={onClose}>
                      <div
                        className={cn(
                          "relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border group-hover:border-blue-500 transition-colors",
                          isDarkMode ? "border-gray-800" : "border-gray-200",
                        )}
                      >
                        <Image
                          src={screen.image || "/placeholder.svg"}
                          alt={screen.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{screen.name}</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Content Pages Section */}
              <div>
                <h3 className={cn("text-sm font-medium mb-4", isDarkMode ? "text-gray-400" : "text-gray-500")}>
                  Content Pages
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {pages.map((page) => (
                    <Link key={page.id} href={page.href} className="group" onClick={onClose}>
                      <div
                        className={cn(
                          "relative aspect-[4/3] rounded-lg overflow-hidden mb-2 border group-hover:border-blue-500 transition-colors",
                          isDarkMode ? "border-gray-800" : "border-gray-200",
                        )}
                      >
                        <Image src={page.image || "/placeholder.svg"} alt={page.name} fill className="object-cover" />
                      </div>
                      <span className={cn("text-sm", isDarkMode ? "text-white" : "text-gray-900")}>{page.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={cn(
            "absolute bottom-0 left-0 w-full border-t p-3 text-xs flex items-center",
            isDarkMode ? "border-gray-800 bg-gray-900 text-gray-400" : "border-gray-200 bg-gray-50 text-gray-500",
          )}
        >
          <Info className="h-4 w-4 mr-2" />
          <span>Press ESC to close or click outside</span>
        </div>
      </div>
    </div>
  )
}
