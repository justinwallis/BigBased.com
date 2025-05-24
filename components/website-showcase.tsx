"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import VerticalLogoScroller from "./vertical-logo-scroller"
import WebsitePreview from "./website-preview"
import { websiteShowcaseData, type WebsiteShowcaseItem } from "@/data/website-showcase-data"

export default function WebsiteShowcase() {
  // Initialize with the first website instead of null
  const [selectedItem, setSelectedItem] = useState<WebsiteShowcaseItem | null>(websiteShowcaseData[0])

  const handleLogoClick = (item: WebsiteShowcaseItem) => {
    setSelectedItem(item)
  }

  return (
    <section className="py-16 px-4 md:px-8 lg:px-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Website Showcase</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our curated collection of websites that exemplify digital sovereignty, traditional values, and
            innovative technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <VerticalLogoScroller
              items={websiteShowcaseData}
              onLogoClick={handleLogoClick}
              selectedItemId={selectedItem?.id || null}
            />
          </div>
          <div className="md:col-span-2 h-[500px]">
            <WebsitePreview item={selectedItem} />
          </div>
        </div>
      </div>
    </section>
  )
}
