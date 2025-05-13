"use client"

import { useRef, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import type { WebsiteShowcaseItem } from "@/data/website-showcase-data"

interface VerticalLogoScrollerProps {
  items: WebsiteShowcaseItem[]
  onLogoClick: (item: WebsiteShowcaseItem) => void
  selectedItemId: string | null
}

export default function VerticalLogoScroller({ items, onLogoClick, selectedItemId }: VerticalLogoScrollerProps) {
  const [isDragging, setIsDragging] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <div className="relative h-full">
      <div
        ref={containerRef}
        className="h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
      >
        <div className="px-4 py-2">
          {items.map((item) => (
            <motion.div
              key={item.id}
              className={`flex items-center space-x-3 p-3 mb-2 rounded-lg cursor-pointer transition-all ${
                selectedItemId === item.id
                  ? "bg-gray-100 dark:bg-gray-700 shadow-sm"
                  : "hover:bg-gray-50 dark:hover:bg-gray-750"
              }`}
              onClick={() => onLogoClick(item)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="relative w-12 h-12 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-md overflow-hidden">
                <Image src={item.logo || "/placeholder.svg"} alt={`${item.name} logo`} fill className="object-cover" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.category}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
