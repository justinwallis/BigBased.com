"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { mediaPersonalities, type MediaPersonality } from "@/data/media-personalities"

export default function TrendingPersonalities() {
  const [trending, setTrending] = useState<MediaPersonality[]>([])

  useEffect(() => {
    // In a real app, this would fetch trending data from an API
    // For now, we'll simulate trending by sorting by total votes and taking the top 5
    const sortedByEngagement = [...mediaPersonalities].sort(
      (a, b) => b.basedVotes + b.cringeVotes - (a.basedVotes + a.cringeVotes),
    )
    setTrending(sortedByEngagement.slice(0, 5))
  }, [])

  return (
    <div className="mb-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold dark:text-white">Trending Personalities</h3>
        <button className="text-sm text-blue-600 dark:text-blue-400 flex items-center">
          View All <ArrowRight size={16} className="ml-1" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {trending.map((personality, index) => {
          // Calculate based percentage
          const totalVotes = personality.basedVotes + personality.cringeVotes
          const basedPercentage = totalVotes > 0 ? Math.round((personality.basedVotes / totalVotes) * 100) : 50

          return (
            <motion.div
              key={personality.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <div className="relative">
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                  <Image
                    src={personality.imageUrl || "/placeholder.svg"}
                    alt={personality.name}
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-gray-100 dark:bg-gray-900 rounded-full px-2 py-1 text-xs font-bold border border-gray-200 dark:border-gray-700">
                  #{index + 1}
                </div>
              </div>

              <h4 className="mt-3 font-medium text-sm dark:text-white">{personality.name}</h4>

              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full ${basedPercentage >= 50 ? "bg-green-500" : "bg-red-500"}`}
                  style={{ width: `${basedPercentage}%` }}
                ></div>
              </div>

              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{basedPercentage}% Based</div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
