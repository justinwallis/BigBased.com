import type React from "react"
import type { SearchableItem } from "@/data/search-data"

// Function to search through items based on a search term
export function searchItems(items: SearchableItem[], searchTerm: string): SearchableItem[] {
  if (!searchTerm.trim()) {
    return []
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim()

  return items.filter((item) => {
    // Search in name
    if (item.name.toLowerCase().includes(normalizedSearchTerm)) {
      return true
    }

    // Search in description
    if (item.description?.toLowerCase().includes(normalizedSearchTerm)) {
      return true
    }

    // Search in tags
    if (item.tags?.some((tag) => tag.toLowerCase().includes(normalizedSearchTerm))) {
      return true
    }

    // Search in category
    if (item.category.toLowerCase().includes(normalizedSearchTerm)) {
      return true
    }

    return false
  })
}

// Function to group search results by category
export function groupSearchResults(results: SearchableItem[]): Record<string, SearchableItem[]> {
  return results.reduce(
    (grouped, item) => {
      const category = item.category
      if (!grouped[category]) {
        grouped[category] = []
      }
      grouped[category].push(item)
      return grouped
    },
    {} as Record<string, SearchableItem[]>,
  )
}

// Function to highlight matching text in a string
export function highlightMatch(text: string, searchTerm: string): React.ReactNode {
  if (!searchTerm.trim()) {
    return text
  }

  const normalizedSearchTerm = searchTerm.toLowerCase().trim()
  const normalizedText = text.toLowerCase()
  const index = normalizedText.indexOf(normalizedSearchTerm)

  if (index === -1) {
    return text
  }

  const before = text.substring(0, index)
  const match = text.substring(index, index + searchTerm.length)
  const after = text.substring(index + searchTerm.length)

  return (
    <>
      {before}
      <span className="bg-yellow-200 dark:bg-yellow-900 text-black dark:text-white font-medium">{match}</span>
      {after}
    </>
  )
}
