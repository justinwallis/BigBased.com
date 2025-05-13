"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronDown } from "lucide-react"

interface DropdownItem {
  label: string
  href: string
  image?: string
  description?: string
}

interface EnhancedDropdownMenuProps {
  label: string
  items: DropdownItem[]
}

export default function EnhancedDropdownMenu({ label, items }: EnhancedDropdownMenuProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="relative group" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <button className="font-medium flex items-center transition-colors duration-200 hover:text-gray-600 dark:text-white dark:hover:text-gray-300">
        {label}
        <ChevronDown className={`h-4 w-4 ml-1 transition-transform duration-300 ${isHovered ? "rotate-180" : ""}`} />
      </button>
      <div className="absolute left-0 mt-2 w-64 bg-white dark:bg-gray-800 shadow-lg rounded-md overflow-hidden z-20 transform opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 origin-top-left">
        {items.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            className="block p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
          >
            <div className="flex items-start">
              {item.image && (
                <div className="flex-shrink-0 mr-3">
                  <Image
                    src={item.image || "/placeholder.svg?height=40&width=40&query=icon"}
                    alt={`${item.label} icon`}
                    width={40}
                    height={40}
                    className="rounded-md object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div>
                <div className="font-medium text-sm dark:text-white">{item.label}</div>
                {item.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
