"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThumbsUp, ThumbsDown, Users } from "lucide-react"
import { topCringeItems, mostBasedItems, factions, type BasedItem, type Faction } from "@/data/live-based-index-data"
import VotingSectionBackground from "./voting-section-background"

// Voting service for the Live Based Index
const BasedVotingService = {
  // Get user votes from localStorage
  getUserVotes: (type: "cringe" | "based" | "faction"): Record<string, "based" | "cringe"> => {
    if (typeof window === "undefined") return {}
    const key = `based-index-${type}-votes`
    const votes = localStorage.getItem(key)
    return votes ? JSON.parse(votes) : {}
  },

  // Save a vote
  saveVote: (id: string, voteType: "based" | "cringe", entityType: "cringe" | "based" | "faction") => {
    if (typeof window === "undefined") return
    const key = `based-index-${entityType}-votes`
    const votes = BasedVotingService.getUserVotes(entityType)
    votes[id] = voteType
    localStorage.setItem(key, JSON.stringify(votes))

    // Log the vote (in a real app, this would send to a server)
    console.log(`Based Index Vote logged: ${entityType} - ${id} - ${voteType}`)
  },

  // Remove a vote
  removeVote: (id: string, entityType: "cringe" | "based" | "faction") => {
    if (typeof window === "undefined") return
    const key = `based-index-${entityType}-votes`
    const votes = BasedVotingService.getUserVotes(entityType)
    delete votes[id]
    localStorage.setItem(key, JSON.stringify(votes))
  },
}

// BasedItem Card Component
const BasedItemCard = ({ item, userVote, onVote, type }) => {
  const [imageError, setImageError] = useState(false)
  const totalVotes = item.basedVotes + item.cringeVotes
  const basedPercentage = totalVotes > 0 ? Math.round((item.basedVotes / totalVotes) * 100) : 50
  const isBasedDominant = item.basedVotes > item.cringeVotes

  // Generate a placeholder image URL with the item title
  const placeholderImage = `/placeholder.svg?height=160&width=320&query=${encodeURIComponent(item.title)}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
    >
      <div className="relative h-40 overflow-hidden">
        <Image
          src={imageError ? placeholderImage : item.imageUrl || placeholderImage}
          alt={item.title}
          fill
          className="object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
          <div className="p-4 text-white">
            <div className="text-xs font-medium px-2 py-1 rounded-full bg-gray-800/60 inline-block mb-2">
              {item.category}
            </div>
            <h3 className="font-bold text-lg">{item.title}</h3>
          </div>
        </div>
      </div>

      <div className="p-4">
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{item.description}</p>

        <div className="mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${isBasedDominant ? "bg-green-500" : "bg-red-500"}`}
              style={{ width: `${isBasedDominant ? basedPercentage : 100 - basedPercentage}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-500">{item.basedVotes} Based</span>
            <span className="text-red-500">{item.cringeVotes} Cringe</span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onVote(item.id, "based")}
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
              onClick={() => onVote(item.id, "cringe")}
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
      </div>
    </motion.div>
  )
}

// Faction Card Component
const FactionCard = ({ faction, userVote, onVote }) => {
  const [imageError, setImageError] = useState(false)
  const totalVotes = faction.basedVotes + faction.cringeVotes
  const basedPercentage = totalVotes > 0 ? Math.round((faction.basedVotes / totalVotes) * 100) : 50

  // Generate a placeholder image URL with the faction name
  const placeholderImage = `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(faction.name + " logo")}`

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border-t-4"
      style={{ borderColor: faction.color }}
    >
      <div className="p-4">
        <div className="flex items-center mb-4">
          <div className="w-16 h-16 relative mr-4 rounded-full overflow-hidden">
            <Image
              src={imageError ? placeholderImage : faction.imageUrl || placeholderImage}
              alt={faction.name}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          </div>
          <div>
            <h3 className="font-bold text-lg dark:text-white">{faction.name}</h3>
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Users size={14} className="mr-1" />
              {faction.members.toLocaleString()} members
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{faction.description}</p>

        <div className="mb-4">
          <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full" style={{ width: `${basedPercentage}%`, backgroundColor: faction.color }}></div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-green-500">{faction.basedVotes.toLocaleString()} Based</span>
            <span className="text-red-500">{faction.cringeVotes.toLocaleString()} Cringe</span>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex space-x-2">
            <button
              onClick={() => onVote(faction.id, "based")}
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
              onClick={() => onVote(faction.id, "cringe")}
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
          <button className="text-sm text-blue-500 hover:underline">Join</button>
        </div>
      </div>
    </motion.div>
  )
}

export default function LiveBasedIndexModule() {
  // State for top cringe items
  const [cringeItems, setCringeItems] = useState<BasedItem[]>(topCringeItems)
  const [cringeUserVotes, setCringeUserVotes] = useState<Record<string, "based" | "cringe">>({})

  // State for most based items
  const [basedItems, setBasedItems] = useState<BasedItem[]>(mostBasedItems)
  const [basedUserVotes, setBasedUserVotes] = useState<Record<string, "based" | "cringe">>({})

  // State for factions
  const [factionList, setFactionList] = useState<Faction[]>(factions)
  const [factionUserVotes, setFactionUserVotes] = useState<Record<string, "based" | "cringe">>({})

  // Load user votes on component mount
  useEffect(() => {
    setCringeUserVotes(BasedVotingService.getUserVotes("cringe"))
    setBasedUserVotes(BasedVotingService.getUserVotes("based"))
    setFactionUserVotes(BasedVotingService.getUserVotes("faction"))
  }, [])

  // Handle voting for cringe items
  const handleCringeVote = (itemId: string, voteType: "based" | "cringe") => {
    const currentVote = cringeUserVotes[itemId]

    // Update local state first for immediate feedback
    const updatedItems = cringeItems.map((item) => {
      if (item.id !== itemId) return item

      // If user already voted this way, remove the vote
      if (currentVote === voteType) {
        return {
          ...item,
          [voteType === "based" ? "basedVotes" : "cringeVotes"]:
            item[voteType === "based" ? "basedVotes" : "cringeVotes"] - 1,
        }
      }

      // If user voted the opposite way, switch the vote
      if (currentVote && currentVote !== voteType) {
        return {
          ...item,
          basedVotes: voteType === "based" ? item.basedVotes + 1 : item.basedVotes - 1,
          cringeVotes: voteType === "cringe" ? item.cringeVotes + 1 : item.cringeVotes - 1,
        }
      }

      // If user hasn't voted yet, add a new vote
      return {
        ...item,
        [voteType === "based" ? "basedVotes" : "cringeVotes"]:
          item[voteType === "based" ? "basedVotes" : "cringeVotes"] + 1,
      }
    })

    setCringeItems(updatedItems)

    // Update user votes
    const newUserVotes = { ...cringeUserVotes }
    if (currentVote === voteType) {
      // Remove vote if clicking the same button
      delete newUserVotes[itemId]
      BasedVotingService.removeVote(itemId, "cringe")
    } else {
      // Add or change vote
      newUserVotes[itemId] = voteType
      BasedVotingService.saveVote(itemId, voteType, "cringe")
    }

    setCringeUserVotes(newUserVotes)
  }

  // Handle voting for based items
  const handleBasedVote = (itemId: string, voteType: "based" | "cringe") => {
    const currentVote = basedUserVotes[itemId]

    // Update local state first for immediate feedback
    const updatedItems = basedItems.map((item) => {
      if (item.id !== itemId) return item

      // If user already voted this way, remove the vote
      if (currentVote === voteType) {
        return {
          ...item,
          [voteType === "based" ? "basedVotes" : "cringeVotes"]:
            item[voteType === "based" ? "basedVotes" : "cringeVotes"] - 1,
        }
      }

      // If user voted the opposite way, switch the vote
      if (currentVote && currentVote !== voteType) {
        return {
          ...item,
          basedVotes: voteType === "based" ? item.basedVotes + 1 : item.basedVotes - 1,
          cringeVotes: voteType === "cringe" ? item.cringeVotes + 1 : item.cringeVotes - 1,
        }
      }

      // If user hasn't voted yet, add a new vote
      return {
        ...item,
        [voteType === "based" ? "basedVotes" : "cringeVotes"]:
          item[voteType === "based" ? "basedVotes" : "cringeVotes"] + 1,
      }
    })

    setBasedItems(updatedItems)

    // Update user votes
    const newUserVotes = { ...basedUserVotes }
    if (currentVote === voteType) {
      // Remove vote if clicking the same button
      delete newUserVotes[itemId]
      BasedVotingService.removeVote(itemId, "based")
    } else {
      // Add or change vote
      newUserVotes[itemId] = voteType
      BasedVotingService.saveVote(itemId, voteType, "based")
    }

    setBasedUserVotes(newUserVotes)
  }

  // Handle voting for factions
  const handleFactionVote = (factionId: string, voteType: "based" | "cringe") => {
    const currentVote = factionUserVotes[factionId]

    // Update local state first for immediate feedback
    const updatedFactions = factionList.map((faction) => {
      if (faction.id !== factionId) return faction

      // If user already voted this way, remove the vote
      if (currentVote === voteType) {
        return {
          ...faction,
          [voteType === "based" ? "basedVotes" : "cringeVotes"]:
            faction[voteType === "based" ? "basedVotes" : "cringeVotes"] - 1,
        }
      }

      // If user voted the opposite way, switch the vote
      if (currentVote && currentVote !== voteType) {
        return {
          ...faction,
          basedVotes: voteType === "based" ? faction.basedVotes + 1 : faction.basedVotes - 1,
          cringeVotes: voteType === "cringe" ? faction.cringeVotes + 1 : faction.cringeVotes - 1,
        }
      }

      // If user hasn't voted yet, add a new vote
      return {
        ...faction,
        [voteType === "based" ? "basedVotes" : "cringeVotes"]:
          faction[voteType === "based" ? "basedVotes" : "cringeVotes"] + 1,
      }
    })

    setFactionList(updatedFactions)

    // Update user votes
    const newUserVotes = { ...factionUserVotes }
    if (currentVote === voteType) {
      // Remove vote if clicking the same button
      delete newUserVotes[factionId]
      BasedVotingService.removeVote(factionId, "faction")
    } else {
      // Add or change vote
      newUserVotes[factionId] = voteType
      BasedVotingService.saveVote(factionId, voteType, "faction")
    }

    setFactionUserVotes(newUserVotes)
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">
      <VotingSectionBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Live Based Index</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Track what's Based and what's Cringe in real-time. Vote on trending topics, factions, and movements to help
            build a community-driven index of cultural truth.
          </p>
        </div>

        <Tabs defaultValue="cringe" className="mb-8">
          {/* Custom styling for the tabs list to improve spacing */}
          <div className="flex justify-center mb-8">
            <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1 max-w-3xl w-full">
              <TabsList className="flex w-full bg-transparent gap-1">
                <TabsTrigger
                  value="cringe"
                  className="flex-1 flex items-center justify-center py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  <div className="flex items-center">
                    <ThumbsDown size={16} className="mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap text-sm">Top Cringe Today</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="based"
                  className="flex-1 flex items-center justify-center py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  <div className="flex items-center">
                    <ThumbsUp size={16} className="mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap text-sm">Most Based This Week</span>
                  </div>
                </TabsTrigger>
                <TabsTrigger
                  value="factions"
                  className="flex-1 flex items-center justify-center py-2 rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 flex-shrink-0" />
                    <span className="whitespace-nowrap text-sm">Faction Leaderboard</span>
                  </div>
                </TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="cringe">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cringeItems.map((item) => (
                <BasedItemCard
                  key={item.id}
                  item={item}
                  userVote={cringeUserVotes[item.id]}
                  onVote={handleCringeVote}
                  type="cringe"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="based">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {basedItems.map((item) => (
                <BasedItemCard
                  key={item.id}
                  item={item}
                  userVote={basedUserVotes[item.id]}
                  onVote={handleBasedVote}
                  type="based"
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="factions">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {factionList.map((faction) => (
                <FactionCard
                  key={faction.id}
                  faction={faction}
                  userVote={factionUserVotes[faction.id]}
                  onVote={handleFactionVote}
                />
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors">
            Submit New Item
          </button>
        </div>
      </div>
    </section>
  )
}
