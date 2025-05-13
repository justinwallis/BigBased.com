export interface BasedItem {
  id: string
  title: string
  description: string
  imageUrl: string
  basedVotes: number
  cringeVotes: number
  timestamp: number // For sorting by recency
  category: string
}

export interface Faction {
  id: string
  name: string
  description: string
  imageUrl: string
  basedVotes: number
  cringeVotes: number
  members: number
  color: string // For styling
}

// Sample data for Top Cringe Today
export const topCringeItems: BasedItem[] = [
  {
    id: "cringe-1",
    title: "Mainstream Media Censorship",
    description: "Major platforms silencing conservative voices under the guise of 'misinformation'",
    imageUrl: "/placeholder.svg?height=160&width=320&query=media%20censorship%20illustration",
    basedVotes: 245,
    cringeVotes: 3245,
    timestamp: Date.now() - 3600000, // 1 hour ago
    category: "Media",
  },
  {
    id: "cringe-2",
    title: "Corporate ESG Initiatives",
    description: "Companies prioritizing woke politics over shareholder value and customer service",
    imageUrl: "/placeholder.svg?height=160&width=320&query=corporate%20ESG%20initiatives",
    basedVotes: 189,
    cringeVotes: 2876,
    timestamp: Date.now() - 7200000, // 2 hours ago
    category: "Business",
  },
  {
    id: "cringe-3",
    title: "Digital ID Proposals",
    description: "Government pushing for centralized digital identity systems with surveillance capabilities",
    imageUrl: "/placeholder.svg?height=160&width=320&query=digital%20ID%20surveillance",
    basedVotes: 321,
    cringeVotes: 2543,
    timestamp: Date.now() - 10800000, // 3 hours ago
    category: "Government",
  },
  {
    id: "cringe-4",
    title: "Big Tech Censorship",
    description: "Tech giants removing content that challenges mainstream narratives",
    imageUrl: "/placeholder.svg?height=160&width=320&query=big%20tech%20censorship",
    basedVotes: 432,
    cringeVotes: 2321,
    timestamp: Date.now() - 14400000, // 4 hours ago
    category: "Tech",
  },
  {
    id: "cringe-5",
    title: "Pharmaceutical Mandates",
    description: "Forcing medical products without proper informed consent or liability",
    imageUrl: "/placeholder.svg?height=160&width=320&query=pharmaceutical%20mandates",
    basedVotes: 567,
    cringeVotes: 2198,
    timestamp: Date.now() - 18000000, // 5 hours ago
    category: "Health",
  },
]

// Sample data for Most Based This Week
export const mostBasedItems: BasedItem[] = [
  {
    id: "based-1",
    title: "Decentralized Social Media",
    description: "New platforms emerging that prioritize free speech and user data ownership",
    imageUrl: "/placeholder.svg?height=160&width=320&query=decentralized%20social%20media",
    basedVotes: 3421,
    cringeVotes: 245,
    timestamp: Date.now() - 86400000, // 1 day ago
    category: "Tech",
  },
  {
    id: "based-2",
    title: "Homeschooling Movement",
    description: "Parents taking control of their children's education away from state influence",
    imageUrl: "/placeholder.svg?height=160&width=320&query=homeschooling%20education",
    basedVotes: 2987,
    cringeVotes: 321,
    timestamp: Date.now() - 172800000, // 2 days ago
    category: "Education",
  },
  {
    id: "based-3",
    title: "Local Food Production",
    description: "Communities building resilience through local farming and food networks",
    imageUrl: "/placeholder.svg?height=160&width=320&query=local%20farming%20community",
    basedVotes: 2765,
    cringeVotes: 189,
    timestamp: Date.now() - 259200000, // 3 days ago
    category: "Food",
  },
  {
    id: "based-4",
    title: "Bitcoin Adoption",
    description: "Growing acceptance of decentralized currency as protection against inflation",
    imageUrl: "/placeholder.svg?height=160&width=320&query=bitcoin%20adoption",
    basedVotes: 2543,
    cringeVotes: 432,
    timestamp: Date.now() - 345600000, // 4 days ago
    category: "Finance",
  },
  {
    id: "based-5",
    title: "Traditional Family Values",
    description: "Renewed focus on the importance of strong families as society's foundation",
    imageUrl: "/placeholder.svg?height=160&width=320&query=traditional%20family%20values",
    basedVotes: 2321,
    cringeVotes: 567,
    timestamp: Date.now() - 432000000, // 5 days ago
    category: "Culture",
  },
]

// Sample data for Faction Leaderboard
export const factions: Faction[] = [
  {
    id: "faction-1",
    name: "Digital Sovereigns",
    description: "Focused on decentralized technology, privacy, and digital rights",
    imageUrl: "/placeholder.svg?height=64&width=64&query=digital%20sovereignty%20icon",
    basedVotes: 8765,
    cringeVotes: 1234,
    members: 12500,
    color: "#3B82F6", // blue
  },
  {
    id: "faction-2",
    name: "Trad Vanguard",
    description: "Preserving traditional values, family structure, and cultural heritage",
    imageUrl: "/placeholder.svg?height=64&width=64&query=traditional%20values%20icon",
    basedVotes: 7654,
    cringeVotes: 2345,
    members: 10800,
    color: "#10B981", // green
  },
  {
    id: "faction-3",
    name: "Liberty Alliance",
    description: "Advocating for individual freedom, limited government, and free markets",
    imageUrl: "/placeholder.svg?height=64&width=64&query=liberty%20icon",
    basedVotes: 6543,
    cringeVotes: 3456,
    members: 9200,
    color: "#F59E0B", // amber
  },
  {
    id: "faction-4",
    name: "Faith Coalition",
    description: "Uniting people of faith to protect religious liberty and moral principles",
    imageUrl: "/placeholder.svg?height=64&width=64&query=faith%20coalition%20icon",
    basedVotes: 5432,
    cringeVotes: 4567,
    members: 8500,
    color: "#8B5CF6", // purple
  },
  {
    id: "faction-5",
    name: "Parallel Economy",
    description: "Building alternative economic systems outside mainstream control",
    imageUrl: "/placeholder.svg?height=64&width=64&query=parallel%20economy%20icon",
    basedVotes: 4321,
    cringeVotes: 5678,
    members: 7800,
    color: "#EC4899", // pink
  },
]
