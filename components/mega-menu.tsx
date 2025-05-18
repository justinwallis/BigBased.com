"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
}

interface MenuSection {
  title: string
  items: MenuItem[]
}

interface PromoItem {
  icon: React.ReactNode
  title: string
  subtitle: string
}

interface MegaMenuProps {
  label: string
  sections: MenuSection[]
  sideSections?: MenuSection[]
  promoItem?: PromoItem
  className?: string
}

export default function MegaMenu({ label, sections, sideSections, promoItem, className }: MegaMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const { isMobile, isTablet } = useMobile()
  const [menuWidth, setMenuWidth] = useState(800)
  const [isVerticalLayout, setIsVerticalLayout] = useState(false)

  // Determine menu width and layout based on screen size
  useEffect(() => {
    const handleResize = () => {
      // Check if window is available (client-side)
      if (typeof window !== "undefined") {
        const viewportWidth = window.innerWidth

        // Set menu width based on viewport
        if (viewportWidth < 640) {
          setMenuWidth(viewportWidth - 40) // Small screens
          setIsVerticalLayout(true)
        } else if (viewportWidth < 1024) {
          setMenuWidth(viewportWidth - 80) // Medium screens
          setIsVerticalLayout(true)
        } else {
          setMenuWidth(800) // Large screens
          setIsVerticalLayout(false)
        }
      }
    }

    // Initial calculation
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close the menu when pressing Escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    document.addEventListener("keydown", handleEscape)
    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        className={cn(
          "flex items-center gap-1 font-medium hover:text-gray-600 dark:text-white dark:hover:text-gray-300 transition-colors duration-200",
          className,
        )}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className={cn(
            "absolute left-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50",
            isVerticalLayout ? "flex flex-col" : "flex",
          )}
          style={{ width: `${menuWidth}px`, maxWidth: "calc(100vw - 40px)" }}
          onMouseLeave={() => !isMobile && setIsOpen(false)}
          role="menu"
        >
          <div className={cn(isVerticalLayout ? "w-full p-4" : "flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6")}>
            {sections.map((section, index) => (
              <div key={index} className={!isVerticalLayout && index >= 2 ? "md:col-span-2" : ""}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">{section.title}</h3>
                <ul className={cn("space-y-2", isVerticalLayout && "grid grid-cols-2 gap-2 space-y-0 mb-6")}>
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                        role="menuitem"
                        onClick={() => setIsOpen(false)}
                      >
                        <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {(sideSections || promoItem) && (
            <div
              className={cn(
                isVerticalLayout
                  ? "w-full bg-gray-50 dark:bg-gray-700 p-4"
                  : "w-[250px] bg-gray-50 dark:bg-gray-700 p-6 flex flex-col",
              )}
            >
              <div className={isVerticalLayout ? "grid grid-cols-2 gap-6" : ""}>
                {sideSections?.map((section, index) => (
                  <div key={index} className="mb-6">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">{section.title}</h3>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <Link
                            href={item.href}
                            className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-colors duration-150"
                            role="menuitem"
                            onClick={() => setIsOpen(false)}
                          >
                            <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {promoItem && (
                <div
                  className={cn(
                    isVerticalLayout
                      ? "mt-2 pt-4 border-t border-gray-200 dark:border-gray-600"
                      : "mt-auto pt-4 border-t border-gray-200 dark:border-gray-600",
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-orange-500">{promoItem.icon}</span>
                    <div>
                      <p className="font-medium">{promoItem.title}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{promoItem.subtitle}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
