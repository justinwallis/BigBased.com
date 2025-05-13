"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown } from "lucide-react"
import { motion } from "framer-motion"
import type { MediaPersonality } from "@/data/media-personalities"

interface PersonalityCardProps {
  personality: MediaPersonality
  userVote: "based" | "cringe" | undefined
  onVote: (id: string, voteType: "based" | "cringe") => void
}

export default function PersonalityCard({ personality, userVote, onVote }: PersonalityCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  const totalVotes = personality.basedVotes + personality.cringeVotes
  const basedPercentage = totalVotes > 0 ? (personality.basedVotes / totalVotes) * 100 : 50

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 relative mr-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
            <Image
              src={personality.imageUrl || "/placeholder.svg"}
              alt={`${personality.name}`}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-white">{personality.name}</h3>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {personality.category}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{personality.description}</p>

        <div className="mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: `${basedPercentage}%` }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-500">{personality.basedVotes} Based</span>
            <span className="text-red-500">{personality.cringeVotes} Cringe</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between">
            <div className="flex space-x-2">
              <button
                onClick={() => onVote(personality.id, "based")}
                className={`px-3 py-1 rounded-md flex items-center text-sm ${
                  userVote === "based"
                    ? "bg-green-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <ThumbsUp size={14} className="mr-1" />
                Based
              </button>
              <button
                onClick={() => onVote(personality.id, "cringe")}
                className={`px-3 py-1 rounded-md flex items-center text-sm ${
                  userVote === "cringe"
                    ? "bg-red-500 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <ThumbsDown size={14} className="mr-1" />
                Cringe
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {personality.platforms.map((platform, index) => (
              <span
                key={index}
                className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full"
              >
                {platform}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
