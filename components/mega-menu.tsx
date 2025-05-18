"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

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
        onMouseEnter={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className="h-4 w-4" />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 mt-2 w-[800px] bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50 flex"
          onMouseLeave={() => setIsOpen(false)}
          role="menu"
        >
          <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.map((section, index) => (
              <div key={index} className={index >= 2 ? "md:col-span-2" : ""}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3">{section.title}</h3>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      <Link
                        href={item.href}
                        className="flex items-center gap-3 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors duration-150"
                        role="menuitem"
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
            <div className="w-[250px] bg-gray-50 dark:bg-gray-700 p-6 flex flex-col">
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
                        >
                          <span className="text-gray-500 dark:text-gray-400">{item.icon}</span>
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              {promoItem && (
                <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-600">
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
