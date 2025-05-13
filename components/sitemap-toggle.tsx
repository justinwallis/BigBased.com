"use client"

import { motion } from "framer-motion"
import { Map } from "lucide-react"

interface SitemapToggleProps {
  isOpen: boolean
  onToggle: () => void
}

export default function SitemapToggle({ isOpen, onToggle }: SitemapToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="fixed bottom-8 right-8 z-50 flex items-center justify-center p-3 rounded-full bg-black text-white dark:bg-white dark:text-black shadow-lg hover:shadow-xl transition-all duration-300"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      aria-label="Toggle sitemap"
    >
      <Map className="w-6 h-6" />
      <span className="ml-2 font-medium">Sitemap</span>
    </motion.button>
  )
}
