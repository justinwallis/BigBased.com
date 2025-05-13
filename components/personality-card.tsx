"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import type { MediaPersonality } from "@/data/media-personalities"

interface PersonalityCardProps {
  personality: MediaPersonality
  userVote?: "based" | "cringe"
  onVote: (personalityId: string, voteType: "based" | "cringe") => void
}

export default function PersonalityCard({ personality, userVote, onVote }: PersonalityCardProps) {
  const [imageError, setImageError] = useState(false)
  const totalVotes = personality.basedVotes + personality.cringeVotes
  const basedPercentage = totalVotes > 0 ? (personality.basedVotes / totalVotes) * 100 : 50

  // Generate a placeholder image URL with the personality name
  const placeholderImage = `/placeholder.svg?height=80&width=80&query=${encodeURIComponent(personality.name + " portrait")}`

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-20 h-20 relative mr-4 overflow-hidden rounded-full border-2 border-gray-200 dark:border-gray-700">
            <Image
              src={imageError ? placeholderImage : personality.imageUrl || placeholderImage}
              alt={personality.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-white">{personality.name}</h3>
            <div className="flex flex-wrap gap-1 mt-1">
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {personality.category}
              </span>
              {personality.platforms.map((platform) => (
                <span
                  key={platform}
                  className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{personality.description}</p>

        <div className="mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
              style={{ width: `${basedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-500 font-medium">{personality.basedVotes} Based</span>
            <span className="text-red-500 font-medium">{personality.cringeVotes} Cringe</span>
          </div>
        </div>

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
          {personality.mainPlatformUrl && (
            <a
              href={personality.mainPlatformUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:underline flex items-center"
            >
              <ExternalLink size={14} className="mr-1" />
              Follow
            </a>
          )}
        </div>
      </div>
    </motion.div>
  )
}
