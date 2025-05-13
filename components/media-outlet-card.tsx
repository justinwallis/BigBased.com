"use client"

import { useState } from "react"
import Image from "next/image"
import { ThumbsUp, ThumbsDown, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import type { MediaOutlet } from "@/data/media-outlets"

interface MediaOutletCardProps {
  outlet: MediaOutlet
  userVote?: "based" | "cringe"
  onVote: (mediaId: string, voteType: "based" | "cringe") => void
}

export default function MediaOutletCard({ outlet, userVote, onVote }: MediaOutletCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageError, setImageError] = useState(false)
  const totalVotes = outlet.basedVotes + outlet.cringeVotes
  const basedPercentage = totalVotes > 0 ? (outlet.basedVotes / totalVotes) * 100 : 50

  // Generate a placeholder image URL with the outlet name
  const placeholderImage = `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(outlet.name + " logo")}`

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 relative mr-4 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
            <Image
              src={imageError ? placeholderImage : outlet.logoUrl || placeholderImage}
              alt={`${outlet.name} logo`}
              width={64}
              height={64}
              className="object-contain p-1"
              onError={() => setImageError(true)}
            />
          </div>
          <div>
            <h3 className="text-lg font-bold dark:text-white">{outlet.name}</h3>
            <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-full">
              {outlet.category}
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">{outlet.description}</p>

        <div className="mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-green-600"
              style={{ width: `${basedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-500 font-medium">{outlet.basedVotes} Based</span>
            <span className="text-red-500 font-medium">{outlet.cringeVotes} Cringe</span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onVote(outlet.id, "based")}
              className={`px-3 py-1 rounded-md flex items-center text-sm transition-colors duration-200 ${
                userVote === "based"
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900/30"
              }`}
              aria-label="Vote as Based"
            >
              <ThumbsUp size={14} className="mr-1" />
              Based
            </button>
            <button
              onClick={() => onVote(outlet.id, "cringe")}
              className={`px-3 py-1 rounded-md flex items-center text-sm transition-colors duration-200 ${
                userVote === "cringe"
                  ? "bg-red-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900/30"
              }`}
              aria-label="Vote as Cringe"
            >
              <ThumbsDown size={14} className="mr-1" />
              Cringe
            </button>
          </div>
          <a
            href={outlet.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline flex items-center"
            aria-label={`Visit ${outlet.name} website`}
          >
            <ExternalLink size={14} className="mr-1" />
            Visit
          </a>
        </div>
      </div>
    </motion.div>
  )
}
