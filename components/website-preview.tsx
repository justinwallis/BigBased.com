"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { ExternalLink, Info, List, Code } from "lucide-react"
import type { WebsiteShowcaseItem } from "@/data/website-showcase-data"

interface WebsitePreviewProps {
  item: WebsiteShowcaseItem | null
}

type TabType = "info" | "features" | "tech"

export default function WebsitePreview({ item }: WebsitePreviewProps) {
  const [activeTab, setActiveTab] = useState<TabType>("info")

  if (!item) {
    return (
      <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg flex items-center justify-center">
        <div className="text-center p-8">
          <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <Info className="h-8 w-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">Select a Website</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-md">
            Click on any logo in the scroller to view detailed information about the website.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-48 md:h-56 lg:h-64 bg-gray-100 dark:bg-gray-700">
        <Image
          src={item.previewImage || "/placeholder.svg"}
          alt={`${item.name} website preview`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h2 className="text-2xl font-bold">{item.name}</h2>
            <p className="text-sm opacity-90">{item.category}</p>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-gray-700">
        <TabButton
          active={activeTab === "info"}
          onClick={() => setActiveTab("info")}
          icon={<Info className="h-4 w-4 mr-2" />}
          label="Info"
        />
        <TabButton
          active={activeTab === "features"}
          onClick={() => setActiveTab("features")}
          icon={<List className="h-4 w-4 mr-2" />}
          label="Features"
        />
        <TabButton
          active={activeTab === "tech"}
          onClick={() => setActiveTab("tech")}
          icon={<Code className="h-4 w-4 mr-2" />}
          label="Technology"
        />
      </div>

      <div className="p-4 h-[calc(100%-64px-48px)] overflow-y-auto">
        <AnimatePresence mode="wait">
          {activeTab === "info" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-gray-700 dark:text-gray-300 mb-6">{item.description}</p>
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors"
              >
                Visit Website
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </motion.div>
          )}

          {activeTab === "features" && (
            <motion.div
              key="features"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Key Features</h3>
              <ul className="space-y-3">
                {item.features.map((feature, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <div className="h-5 w-5 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-black dark:bg-white"></div>
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {activeTab === "tech" && (
            <motion.div
              key="tech"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Technology Stack</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {item.technologies.map((tech, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-md p-3"
                  >
                    <span className="text-gray-700 dark:text-gray-300">{tech}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

interface TabButtonProps {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}

function TabButton({ active, onClick, icon, label }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-3 px-4 text-center flex items-center justify-center text-sm font-medium transition-colors relative ${
        active
          ? "text-black dark:text-white"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
      }`}
    >
      {icon}
      {label}
      {active && (
        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white" />
      )}
    </button>
  )
}
