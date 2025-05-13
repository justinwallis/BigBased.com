export type MediaCategory = "News" | "Opinion" | "Analysis" | "Entertainment" | "Tech" | "Finance"

export interface MediaOutlet {
  id: string
  name: string
  description: string
  url: string
  logoUrl: string
  category: MediaCategory
  basedVotes: number
  cringeVotes: number
}

export const mediaOutlets: MediaOutlet[] = [
  {
    id: "breitbart",
    name: "Breitbart",
    description: "Conservative news and opinion website founded by Andrew Breitbart",
    url: "https://www.breitbart.com",
    logoUrl: "/media-logos/breitbart.png",
    category: "News",
    basedVotes: 1245,
    cringeVotes: 432,
  },
  {
    id: "daily-wire",
    name: "The Daily Wire",
    description: "American conservative news website founded by Ben Shapiro",
    url: "https://www.dailywire.com",
    logoUrl: "/media-logos/daily-wire.png",
    category: "News",
    basedVotes: 1876,
    cringeVotes: 345,
  },
  {
    id: "epoch-times",
    name: "The Epoch Times",
    description: "International multi-language newspaper and media company",
    url: "https://www.theepochtimes.com",
    logoUrl: "/media-logos/epoch-times.png",
    category: "News",
    basedVotes: 987,
    cringeVotes: 421,
  },
  {
    id: "newsmax",
    name: "Newsmax",
    description: "Conservative American news and opinion website",
    url: "https://www.newsmax.com",
    logoUrl: "/media-logos/newsmax.png",
    category: "News",
    basedVotes: 876,
    cringeVotes: 543,
  },
  {
    id: "oann",
    name: "One America News Network",
    description: "Right-wing pay television news channel",
    url: "https://www.oann.com",
    logoUrl: "/media-logos/oann.png",
    category: "News",
    basedVotes: 765,
    cringeVotes: 654,
  },
  {
    id: "blaze",
    name: "The Blaze",
    description: "Conservative news and entertainment network founded by Glenn Beck",
    url: "https://www.theblaze.com",
    logoUrl: "/media-logos/blaze-media.png",
    category: "News",
    basedVotes: 654,
    cringeVotes: 321,
  },
  {
    id: "washington-times",
    name: "The Washington Times",
    description: "Conservative daily newspaper published in Washington, D.C.",
    url: "https://www.washingtontimes.com",
    logoUrl: "/media-logos/washington-times.png",
    category: "News",
    basedVotes: 543,
    cringeVotes: 432,
  },
  {
    id: "cnn",
    name: "CNN",
    description: "Cable News Network - American basic cable news channel",
    url: "https://www.cnn.com",
    logoUrl: "/media-logos/cnn.png",
    category: "News",
    basedVotes: 432,
    cringeVotes: 1876,
  },
  {
    id: "msnbc",
    name: "MSNBC",
    description: "American news-based pay television cable channel",
    url: "https://www.msnbc.com",
    logoUrl: "/media-logos/msnbc.png",
    category: "News",
    basedVotes: 321,
    cringeVotes: 1654,
  },
  {
    id: "washington-post",
    name: "The Washington Post",
    description: "American daily newspaper published in Washington, D.C.",
    url: "https://www.washingtonpost.com",
    logoUrl: "/media-logos/washington-post.png",
    category: "News",
    basedVotes: 234,
    cringeVotes: 1543,
  },
  {
    id: "new-york-times",
    name: "The New York Times",
    description: "American daily newspaper based in New York City",
    url: "https://www.nytimes.com",
    logoUrl: "/media-logos/new-york-times.png",
    category: "News",
    basedVotes: 345,
    cringeVotes: 1432,
  },
]
