"use client"

import { useState, useEffect } from "react"
import { Search, Filter, ArrowUpDown } from "lucide-react"
import { mediaOutlets, type MediaOutlet } from "@/data/media-outlets"
import { mediaPersonalities, type MediaPersonality } from "@/data/media-personalities"
import MediaOutletCard from "./media-outlet-card"
import PersonalityCard from "./personality-card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import VotingSectionBackground from "./voting-section-background"

// Voting service to handle vote operations
const VotingService = {
  // Get user votes from localStorage
  getUserVotes: (type: "outlets" | "personalities"): Record<string, "based" | "cringe"> => {
    if (typeof window === "undefined") return {}
    const key = type === "outlets" ? "media-votes" : "personality-votes"
    const votes = localStorage.getItem(key)
    return votes ? JSON.parse(votes) : {}
  },

  // Save a vote
  saveVote: (id: string, voteType: "based" | "cringe", entityType: "outlets" | "personalities") => {
    if (typeof window === "undefined") return
    const key = entityType === "outlets" ? "media-votes" : "personality-votes"
    const votes = VotingService.getUserVotes(entityType)
    votes[id] = voteType
    localStorage.setItem(key, JSON.stringify(votes))

    // Log the vote (in a real app, this would send to a server)
    console.log(`Vote logged: ${entityType} - ${id} - ${voteType}`)
  },

  // Remove a vote
  removeVote: (id: string, entityType: "outlets" | "personalities") => {
    if (typeof window === "undefined") return
    const key = entityType === "outlets" ? "media-votes" : "personality-votes"
    const votes = VotingService.getUserVotes(entityType)
    delete votes[id]
    localStorage.setItem(key, JSON.stringify(votes))
  },
}

export default function MediaVotingPlatform() {
  // State for outlets
  const [outlets, setOutlets] = useState<MediaOutlet[]>(mediaOutlets)
  const [filteredOutlets, setFilteredOutlets] = useState<MediaOutlet[]>(mediaOutlets)
  const [outletUserVotes, setOutletUserVotes] = useState<Record<string, "based" | "cringe">>({})

  // State for personalities
  const [personalities, setPersonalities] = useState<MediaPersonality[]>(mediaPersonalities)
  const [filteredPersonalities, setFilteredPersonalities] = useState<MediaPersonality[]>(mediaPersonalities)
  const [personalityUserVotes, setPersonalityUserVotes] = useState<Record<string, "based" | "cringe">>({})

  // Shared state
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<"outlets" | "personalities">("outlets")
  const [sortBy, setSortBy] = useState<"basedVotes" | "cringeVotes" | "name">("basedVotes")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [outletCategory, setOutletCategory] = useState<string>("All")
  const [personalityCategory, setPersonalityCategory] = useState<string>("All")

  // Load user votes on component mount
  useEffect(() => {
    setOutletUserVotes(VotingService.getUserVotes("outlets"))
    setPersonalityUserVotes(VotingService.getUserVotes("personalities"))
  }, [])

  // Handle voting for outlets
  const handleOutletVote = (mediaId: string, voteType: "based" | "cringe") => {
    const currentVote = outletUserVotes[mediaId]

    // Update local state first for immediate feedback
    const updatedOutlets = outlets.map((outlet) => {
      if (outlet.id !== mediaId) return outlet

      // If user already voted this way, remove the vote
      if (currentVote === voteType) {
        return {
          ...outlet,
          [voteType === "based" ? "basedVotes" : "cringeVotes"]:
            outlet[voteType === "based" ? "basedVotes" : "cringeVotes"] - 1,
        }
      }

      // If user voted the opposite way, switch the vote
      if (currentVote && currentVote !== voteType) {
        return {
          ...outlet,
          basedVotes: voteType === "based" ? outlet.basedVotes + 1 : outlet.basedVotes - 1,
          cringeVotes: voteType === "cringe" ? outlet.cringeVotes + 1 : outlet.cringeVotes - 1,
        }
      }

      // If user hasn't voted yet, add a new vote
      return {
        ...outlet,
        [voteType === "based" ? "basedVotes" : "cringeVotes"]:
          outlet[voteType === "based" ? "basedVotes" : "cringeVotes"] + 1,
      }
    })

    setOutlets(updatedOutlets)

    // Update user votes
    const newUserVotes = { ...outletUserVotes }
    if (currentVote === voteType) {
      // Remove vote if clicking the same button
      delete newUserVotes[mediaId]
      VotingService.removeVote(mediaId, "outlets")
    } else {
      // Add or change vote
      newUserVotes[mediaId] = voteType
      VotingService.saveVote(mediaId, voteType, "outlets")
    }

    setOutletUserVotes(newUserVotes)
  }

  // Handle voting for personalities
  const handlePersonalityVote = (personalityId: string, voteType: "based" | "cringe") => {
    const currentVote = personalityUserVotes[personalityId]

    // Update local state first for immediate feedback
    const updatedPersonalities = personalities.map((personality) => {
      if (personality.id !== personalityId) return personality

      // If user already voted this way, remove the vote
      if (currentVote === voteType) {
        return {
          ...personality,
          [voteType === "based" ? "basedVotes" : "cringeVotes"]:
            personality[voteType === "based" ? "basedVotes" : "cringeVotes"] - 1,
        }
      }

      // If user voted the opposite way, switch the vote
      if (currentVote && currentVote !== voteType) {
        return {
          ...personality,
          basedVotes: voteType === "based" ? personality.basedVotes + 1 : personality.basedVotes - 1,
          cringeVotes: voteType === "cringe" ? personality.cringeVotes + 1 : personality.cringeVotes - 1,
        }
      }

      // If user hasn't voted yet, add a new vote
      return {
        ...personality,
        [voteType === "based" ? "basedVotes" : "cringeVotes"]:
          personality[voteType === "based" ? "basedVotes" : "cringeVotes"] + 1,
      }
    })

    setPersonalities(updatedPersonalities)

    // Update user votes
    const newUserVotes = { ...personalityUserVotes }
    if (currentVote === voteType) {
      // Remove vote if clicking the same button
      delete newUserVotes[personalityId]
      VotingService.removeVote(personalityId, "personalities")
    } else {
      // Add or change vote
      newUserVotes[personalityId] = voteType
      VotingService.saveVote(personalityId, voteType, "personalities")
    }

    setPersonalityUserVotes(newUserVotes)
  }

  // Filter and sort outlets when dependencies change
  useEffect(() => {
    let result = [...outlets]

    // Apply category filter
    if (outletCategory !== "All") {
      result = result.filter((outlet) => outlet.category === outletCategory)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (outlet) => outlet.name.toLowerCase().includes(term) || outlet.description.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    })

    setFilteredOutlets(result)
  }, [outlets, outletCategory, searchTerm, sortBy, sortDirection])

  // Filter and sort personalities when dependencies change
  useEffect(() => {
    let result = [...personalities]

    // Apply category filter
    if (personalityCategory !== "All") {
      result = result.filter((personality) => personality.category === personalityCategory)
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (personality) =>
          personality.name.toLowerCase().includes(term) || personality.description.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortBy === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      }

      return sortDirection === "asc" ? a[sortBy] - b[sortBy] : b[sortBy] - a[sortBy]
    })

    setFilteredPersonalities(result)
  }, [personalities, personalityCategory, searchTerm, sortBy, sortDirection])

  // Toggle sort direction
  const toggleSort = (newSortBy: "basedVotes" | "cringeVotes" | "name") => {
    if (sortBy === newSortBy) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortBy(newSortBy)
      setSortDirection("desc") // Default to descending for new sort
    }
  }

  // Get all categories for the active tab
  const getCategories = () => {
    if (activeTab === "outlets") {
      return ["All", "News", "Opinion", "Analysis", "Entertainment", "Tech", "Finance"]
    } else {
      return ["All", "Commentator", "Host", "Journalist", "Influencer", "Analyst", "Podcaster"]
    }
  }

  // Get the current category
  const getCurrentCategory = () => {
    return activeTab === "outlets" ? outletCategory : personalityCategory
  }

  // Set the current category
  const setCurrentCategory = (category: string) => {
    if (activeTab === "outlets") {
      setOutletCategory(category)
    } else {
      setPersonalityCategory(category)
    }
  }

  return (
    <section className="py-16 px-4 md:px-8 bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
      <VotingSectionBackground />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 dark:text-white">Media Truth Index</h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Vote on which media outlets and personalities are Based (truthful, principled) or Cringe (biased,
            misleading). Help build a community-driven index of trustworthy information sources.
          </p>
        </div>

        {/* Add the TrendingPersonalities component here */}
        <Tabs
          defaultValue="outlets"
          className="mb-8"
          onValueChange={(value) => setActiveTab(value as "outlets" | "personalities")}
        >
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
            <TabsTrigger value="outlets">Media Outlets</TabsTrigger>
            <TabsTrigger value="personalities">Media Personalities</TabsTrigger>
          </TabsList>

          <div className="mb-8 flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder={`Search ${activeTab === "outlets" ? "media outlets" : "personalities"}...`}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={getCurrentCategory()}
                  onChange={(e) => setCurrentCategory(e.target.value)}
                >
                  {getCategories().map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>

              <div className="relative">
                <select
                  className="appearance-none pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  value={`${sortBy}-${sortDirection}`}
                  onChange={(e) => {
                    const [newSortBy, newSortDirection] = e.target.value.split("-") as [
                      "basedVotes" | "cringeVotes" | "name",
                      "asc" | "desc",
                    ]
                    setSortBy(newSortBy)
                    setSortDirection(newSortDirection)
                  }}
                >
                  <option value="basedVotes-desc">Most Based</option>
                  <option value="cringeVotes-desc">Most Cringe</option>
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                </select>
                <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          <TabsContent value="outlets">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOutlets.map((outlet) => (
                <MediaOutletCard
                  key={outlet.id}
                  outlet={outlet}
                  userVote={outletUserVotes[outlet.id]}
                  onVote={handleOutletVote}
                />
              ))}
            </div>

            {filteredOutlets.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No media outlets found matching your criteria.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="personalities">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPersonalities.map((personality) => (
                <PersonalityCard
                  key={personality.id}
                  personality={personality}
                  userVote={personalityUserVotes[personality.id]}
                  onVote={handlePersonalityVote}
                />
              ))}
            </div>

            {filteredPersonalities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">No personalities found matching your criteria.</p>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Want to suggest a media outlet or personality for inclusion?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              Contact us
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
