// Structured data types for JSON-LD
export type Organization = {
  "@context": string
  "@type": string
  name: string
  url: string
  logo: string
  sameAs?: string[]
  description?: string
  foundingDate?: string
  founders?: Person[]
  address?: PostalAddress
}

export type WebSite = {
  "@context": string
  "@type": string
  name: string
  url: string
  potentialAction?: SearchAction
  publisher?: Organization
}

export type WebPage = {
  "@context": string
  "@type": string
  name: string
  description?: string
  url: string
  isPartOf?: WebSite
  breadcrumb?: BreadcrumbList
  image?: string
  datePublished?: string
  dateModified?: string
}

export type Article = {
  "@context": string
  "@type": string
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author: Person
  publisher: Organization
  mainEntityOfPage: string
}

export type BreadcrumbList = {
  "@context": string
  "@type": string
  itemListElement: BreadcrumbItem[]
}

export type BreadcrumbItem = {
  "@type": string
  position: number
  name: string
  item?: string
}

export type Person = {
  "@type": string
  name: string
  url?: string
}

export type PostalAddress = {
  "@type": string
  streetAddress?: string
  addressLocality?: string
  addressRegion?: string
  postalCode?: string
  addressCountry?: string
}

export type SearchAction = {
  "@type": string
  target: string
  "query-input": string
}

// FAQ Schema Types
export type FAQPage = {
  "@context": string
  "@type": string
  mainEntity: Question[]
}

export type Question = {
  "@type": string
  name: string
  acceptedAnswer: Answer
}

export type Answer = {
  "@type": string
  text: string
}

// Base URL for the website
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://bigbased.com"

// Organization data
export const getOrganizationData = (): Organization => {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Big Based",
    url: baseUrl,
    logo: `${baseUrl}/bb-logo.png`,
    description:
      "A cultural revolution platform dedicated to reclaiming digital sovereignty, preserving truth, and building a parallel economy.",
    foundingDate: "2023",
    sameAs: ["https://twitter.com/bigbased", "https://facebook.com/bigbased", "https://linkedin.com/company/bigbased"],
  }
}

// Website data
export const getWebsiteData = (): WebSite => {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Big Based",
    url: baseUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
    publisher: getOrganizationData(),
  }
}

// WebPage data
export const getWebPageData = (
  title: string,
  description: string,
  path: string,
  imageUrl?: string,
  datePublished?: string,
  dateModified?: string,
): WebPage => {
  const url = `${baseUrl}${path}`

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: title,
    description: description,
    url: url,
    isPartOf: getWebsiteData(),
    image: imageUrl || `${baseUrl}/og-image.png`,
    datePublished: datePublished || new Date().toISOString(),
    dateModified: dateModified || new Date().toISOString(),
  }
}

// Article data
export const getArticleData = (
  title: string,
  description: string,
  path: string,
  imageUrl: string,
  datePublished: string,
  dateModified?: string,
  authorName = "Big Based Team",
): Article => {
  const url = `${baseUrl}${path}`

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description: description,
    image: imageUrl,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: getOrganizationData(),
    mainEntityOfPage: url,
  }
}

// BreadcrumbList data
export const getBreadcrumbData = (items: { name: string; path: string }[]): BreadcrumbList => {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? `${baseUrl}${item.path}` : undefined,
    })),
  }
}

// FAQ Page data
export const getFAQPageData = (questions: { question: string; answer: string }[]): FAQPage => {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}
