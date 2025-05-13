export type PersonalityCategory = "Commentator" | "Host" | "Journalist" | "Influencer" | "Analyst" | "Podcaster"

export interface MediaPersonality {
  id: string
  name: string
  description: string
  imageUrl: string
  category: PersonalityCategory
  platforms: string[] // Social media or platforms where they appear
  basedVotes: number
  cringeVotes: number
}

export const mediaPersonalities: MediaPersonality[] = [
  {
    id: "nick-fuentes",
    name: "Nick Fuentes",
    description: "American political commentator and live streamer known for his nationalist and conservative views.",
    imageUrl: "/personality-images/nick-fuentes.png",
    category: "Commentator",
    platforms: ["Cozy.tv", "Telegram", "X"],
    basedVotes: 1876,
    cringeVotes: 1243,
  },
  {
    id: "myron-gaines",
    name: "Myron Gaines",
    description:
      "Co-host of the Fresh & Fit Podcast, known for discussing dating strategies and male self-improvement.",
    imageUrl: "/personality-images/myron-gaines.png",
    category: "Podcaster",
    platforms: ["YouTube", "Spotify", "Instagram"],
    basedVotes: 1543,
    cringeVotes: 876,
  },
  {
    id: "tucker-carlson",
    name: "Tucker Carlson",
    description: "American conservative political commentator and former television host.",
    imageUrl: "/personality-images/tucker-carlson.png",
    category: "Host",
    platforms: ["X", "Fox News (former)", "Tucker Carlson Network"],
    basedVotes: 2345,
    cringeVotes: 1432,
  },
  {
    id: "candace-owens",
    name: "Candace Owens",
    description: "American conservative author, talk show host, political commentator, and activist.",
    imageUrl: "/personality-images/candace-owens.png",
    category: "Commentator",
    platforms: ["Daily Wire", "X", "Instagram"],
    basedVotes: 1987,
    cringeVotes: 1123,
  },
  {
    id: "joe-rogan",
    name: "Joe Rogan",
    description: "American podcaster, UFC commentator, comedian, and former television host.",
    imageUrl: "/personality-images/joe-rogan.png",
    category: "Podcaster",
    platforms: ["Spotify", "YouTube", "X"],
    basedVotes: 2156,
    cringeVotes: 987,
  },
  {
    id: "ben-shapiro",
    name: "Ben Shapiro",
    description: "American conservative political commentator, media host, and attorney.",
    imageUrl: "/personality-images/ben-shapiro.png",
    category: "Commentator",
    platforms: ["Daily Wire", "X", "YouTube"],
    basedVotes: 1765,
    cringeVotes: 1432,
  },
  {
    id: "andrew-tate",
    name: "Andrew Tate",
    description: "British-American internet personality, former professional kickboxer, and entrepreneur.",
    imageUrl: "/personality-images/andrew-tate.png",
    category: "Influencer",
    platforms: ["X", "Rumble", "Telegram"],
    basedVotes: 1876,
    cringeVotes: 1654,
  },
  {
    id: "jordan-peterson",
    name: "Jordan Peterson",
    description: "Canadian clinical psychologist, author, and professor emeritus at the University of Toronto.",
    imageUrl: "/personality-images/jordan-peterson.png",
    category: "Commentator",
    platforms: ["YouTube", "X", "Daily Wire+"],
    basedVotes: 2134,
    cringeVotes: 987,
  },
  {
    id: "matt-walsh",
    name: "Matt Walsh",
    description: "American conservative political commentator, author, and filmmaker.",
    imageUrl: "/personality-images/matt-walsh.png",
    category: "Commentator",
    platforms: ["Daily Wire", "X", "YouTube"],
    basedVotes: 1654,
    cringeVotes: 876,
  },
  {
    id: "tim-pool",
    name: "Tim Pool",
    description: "American journalist, political commentator, and YouTuber.",
    imageUrl: "/personality-images/tim-pool.png",
    category: "Journalist",
    platforms: ["YouTube", "X", "Timcast IRL"],
    basedVotes: 1432,
    cringeVotes: 1123,
  },
]

export const personalityCategories: PersonalityCategory[] = [
  "Commentator",
  "Host",
  "Journalist",
  "Influencer",
  "Analyst",
  "Podcaster",
]
