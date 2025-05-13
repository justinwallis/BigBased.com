export type PersonalityCategory = "Commentator" | "Host" | "Journalist" | "Influencer" | "Analyst" | "Podcaster"

export interface MediaPersonality {
  id: string
  name: string
  description: string
  imageUrl: string
  category: PersonalityCategory
  platforms: string[]
  mainPlatformUrl?: string
  basedVotes: number
  cringeVotes: number
}

export const mediaPersonalities: MediaPersonality[] = [
  {
    id: "nick-fuentes",
    name: "Nick Fuentes",
    description:
      "America First commentator and political activist known for his controversial views and commentary on politics and culture.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Nick%20Fuentes%20portrait",
    category: "Commentator",
    platforms: ["X", "Rumble", "Cozy.tv"],
    mainPlatformUrl: "https://cozy.tv/nick",
    basedVotes: 2345,
    cringeVotes: 1876,
  },
  {
    id: "myron-gaines",
    name: "Myron Gaines",
    description:
      "Co-host of the Fresh & Fit Podcast, known for discussions on dating, fitness, and male self-improvement.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Myron%20Gaines%20portrait",
    category: "Podcaster",
    platforms: ["YouTube", "Spotify", "Instagram"],
    mainPlatformUrl: "https://www.youtube.com/c/FreshandFit",
    basedVotes: 1987,
    cringeVotes: 1432,
  },
  {
    id: "tucker-carlson",
    name: "Tucker Carlson",
    description: "Former Fox News host and current independent commentator known for his conservative political views.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Tucker%20Carlson%20portrait",
    category: "Host",
    platforms: ["X", "YouTube", "Fox Nation"],
    mainPlatformUrl: "https://twitter.com/TuckerCarlson",
    basedVotes: 3456,
    cringeVotes: 2345,
  },
  {
    id: "candace-owens",
    name: "Candace Owens",
    description:
      "Conservative author, commentator, and political activist known for her criticism of progressive politics.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Candace%20Owens%20portrait",
    category: "Commentator",
    platforms: ["X", "Instagram", "YouTube"],
    mainPlatformUrl: "https://twitter.com/RealCandaceO",
    basedVotes: 2876,
    cringeVotes: 1765,
  },
  {
    id: "joe-rogan",
    name: "Joe Rogan",
    description:
      "Comedian, UFC commentator, and host of The Joe Rogan Experience podcast featuring long-form conversations.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Joe%20Rogan%20portrait",
    category: "Podcaster",
    platforms: ["Spotify", "YouTube", "X"],
    mainPlatformUrl: "https://open.spotify.com/show/4rOoJ6Egrf8K2IrywzwOMk",
    basedVotes: 4321,
    cringeVotes: 1234,
  },
  {
    id: "ben-shapiro",
    name: "Ben Shapiro",
    description: "Conservative political commentator, author, and founder of The Daily Wire media company.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Ben%20Shapiro%20portrait",
    category: "Commentator",
    platforms: ["X", "YouTube", "Daily Wire"],
    mainPlatformUrl: "https://www.youtube.com/c/BenShapiro",
    basedVotes: 2543,
    cringeVotes: 2198,
  },
  {
    id: "andrew-tate",
    name: "Andrew Tate",
    description:
      "Former kickboxer, entrepreneur, and internet personality known for his controversial views on masculinity.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Andrew%20Tate%20portrait",
    category: "Influencer",
    platforms: ["X", "Rumble", "TikTok"],
    mainPlatformUrl: "https://twitter.com/Cobratate",
    basedVotes: 3210,
    cringeVotes: 2987,
  },
  {
    id: "jordan-peterson",
    name: "Jordan Peterson",
    description:
      "Canadian clinical psychologist, author, and professor known for his views on cultural and political issues.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Jordan%20Peterson%20portrait",
    category: "Analyst",
    platforms: ["X", "YouTube", "Daily Wire+"],
    mainPlatformUrl: "https://www.youtube.com/c/JordanPetersonVideos",
    basedVotes: 3654,
    cringeVotes: 1543,
  },
  {
    id: "matt-walsh",
    name: "Matt Walsh",
    description: "Conservative political commentator, author, and documentary filmmaker at The Daily Wire.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Matt%20Walsh%20portrait",
    category: "Commentator",
    platforms: ["X", "YouTube", "Daily Wire"],
    mainPlatformUrl: "https://twitter.com/MattWalshBlog",
    basedVotes: 2198,
    cringeVotes: 1876,
  },
  {
    id: "tim-pool",
    name: "Tim Pool",
    description: "Political commentator and podcast host known for his news analysis and commentary.",
    imageUrl: "/placeholder.svg?height=80&width=80&query=Tim%20Pool%20portrait",
    category: "Podcaster",
    platforms: ["YouTube", "Rumble", "X"],
    mainPlatformUrl: "https://www.youtube.com/c/Timcast",
    basedVotes: 2765,
    cringeVotes: 1654,
  },
]
