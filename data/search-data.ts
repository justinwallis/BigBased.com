// Define types for searchable content
export type SearchableItem = {
  id: string
  name: string
  description?: string
  image?: string
  icon?: string
  href: string
  category: string
  tags?: string[]
  type: "feature" | "screen" | "page" | "resource" | "article" | "video"
}

// Features/Apps data
export const featuresData: SearchableItem[] = [
  {
    id: "digital-library",
    name: "Digital Library",
    description: "Access our collection of books, articles, and resources",
    icon: "/digital-library.png",
    href: "/features/library",
    category: "features",
    tags: ["books", "reading", "education", "resources"],
    type: "feature",
  },
  {
    id: "community",
    name: "Community",
    description: "Connect with like-minded individuals in our community spaces",
    icon: "/diverse-community-gathering.png",
    href: "/features/community",
    category: "features",
    tags: ["social", "network", "connect", "people"],
    type: "feature",
  },
  {
    id: "resources",
    name: "Resource Toolkit",
    description: "Tools and resources to help you on your journey",
    icon: "/resource-toolkit.png",
    href: "/features/resources",
    category: "features",
    tags: ["tools", "resources", "help", "support"],
    type: "feature",
  },
  {
    id: "revolution",
    name: "Revolution",
    description: "Join the movement for digital sovereignty and freedom",
    icon: "/revolution-background.png",
    href: "/revolution",
    category: "features",
    tags: ["movement", "action", "change", "freedom"],
    type: "feature",
  },
  {
    id: "partners",
    name: "Partners",
    description: "Organizations and individuals we work with",
    icon: "/partnership-hands.png",
    href: "/partners",
    category: "features",
    tags: ["organizations", "allies", "collaboration", "network"],
    type: "feature",
  },
  {
    id: "transform",
    name: "Transform",
    description: "Tools for personal and community transformation",
    icon: "/abstract-digital-landscape.png",
    href: "/transform",
    category: "features",
    tags: ["change", "growth", "development", "improvement"],
    type: "feature",
  },
]

// Screens data
export const screensData: SearchableItem[] = [
  {
    id: "home",
    name: "Home",
    description: "Main landing page with key information and navigation",
    image: "/website-preview.png",
    href: "/",
    category: "screens",
    tags: ["main", "landing", "start", "homepage"],
    type: "screen",
  },
  {
    id: "about",
    name: "About",
    description: "Learn about our mission, vision, and values",
    image: "/mission-statement-document.png",
    href: "/about",
    category: "screens",
    tags: ["mission", "vision", "values", "purpose"],
    type: "screen",
  },
  {
    id: "features",
    name: "Features",
    description: "Explore the features and capabilities of Big Based",
    image: "/digital-library.png",
    href: "/features",
    category: "screens",
    tags: ["capabilities", "offerings", "services", "tools"],
    type: "screen",
  },
  {
    id: "contact",
    name: "Contact",
    description: "Get in touch with our team",
    image: "/diverse-group.png",
    href: "/contact",
    category: "screens",
    tags: ["reach out", "message", "email", "connect"],
    type: "screen",
  },
  {
    id: "profile",
    name: "Profile",
    description: "Manage your personal profile and settings",
    image: "/abstract-profile.png",
    href: "/profile",
    category: "screens",
    tags: ["account", "settings", "personal", "user"],
    type: "screen",
  },
  {
    id: "faq",
    name: "FAQ",
    description: "Frequently asked questions and answers",
    image: "/resource-toolkit.png",
    href: "/faq",
    category: "screens",
    tags: ["questions", "help", "support", "information"],
    type: "screen",
  },
]

// Content pages data
export const pagesData: SearchableItem[] = [
  {
    id: "mission",
    name: "Mission",
    description: "Our purpose and what drives us forward",
    image: "/mission-statement-document.png",
    href: "/about/mission",
    category: "pages",
    tags: ["purpose", "goals", "objectives", "vision"],
    type: "page",
  },
  {
    id: "team",
    name: "Team",
    description: "Meet the people behind Big Based",
    image: "/team-of-professionals.png",
    href: "/about/team",
    category: "pages",
    tags: ["people", "staff", "leadership", "members"],
    type: "page",
  },
  {
    id: "history",
    name: "History",
    description: "The story of how Big Based came to be",
    image: "/historical-timeline.png",
    href: "/about/history",
    category: "pages",
    tags: ["timeline", "story", "past", "origins"],
    type: "page",
  },
  {
    id: "manifesto",
    name: "Manifesto",
    description: "Our declaration of principles and intentions",
    image: "/manifesto-document.png",
    href: "/revolution/manifesto",
    category: "pages",
    tags: ["declaration", "principles", "beliefs", "values"],
    type: "page",
  },
]

// Resources data
export const resourcesData: SearchableItem[] = [
  {
    id: "constitution-primer",
    name: "The Constitution: A Primer",
    description: "An essential guide to understanding the U.S. Constitution and its principles",
    image: "/constitution-primer-cover.png",
    href: "/resources/constitution-primer",
    category: "resources",
    tags: ["constitution", "government", "law", "rights"],
    type: "resource",
  },
  {
    id: "digital-sovereignty",
    name: "Digital Sovereignty",
    description: "How to reclaim your digital life from Big Tech surveillance and control",
    image: "/book-cover-digital-sovereignty.png",
    href: "/resources/digital-sovereignty",
    category: "resources",
    tags: ["privacy", "technology", "independence", "security"],
    type: "resource",
  },
  {
    id: "faith-freedom",
    name: "Faith and Freedom",
    description: "Exploring the essential relationship between religious faith and political liberty",
    image: "/book-cover-faith-freedom.png",
    href: "/resources/faith-freedom",
    category: "resources",
    tags: ["religion", "liberty", "faith", "politics"],
    type: "resource",
  },
  {
    id: "free-market",
    name: "Free Market Principles",
    description: "A comprehensive guide to understanding free market economics and its benefits",
    image: "/free-market-principles-cover.png",
    href: "/resources/free-market",
    category: "resources",
    tags: ["economics", "market", "capitalism", "trade"],
    type: "resource",
  },
]

// Combine all searchable data
export const allSearchableItems: SearchableItem[] = [...featuresData, ...screensData, ...pagesData, ...resourcesData]

// Function to get featured items for initial display
export const getFeaturedItems = (): Record<string, SearchableItem[]> => {
  return {
    features: featuresData.slice(0, 6),
    screens: screensData.slice(0, 6),
    pages: pagesData.slice(0, 4),
  }
}
