"use client"

import { useState } from "react"

interface CategoryFilterProps {
  categories: { id: string; name: string }[]
  selectedCategories: string[]
  onCategoryChange: (categories: string[]) => void
}

export default function CategoryFilter({ categories, selectedCategories, onCategoryChange }: CategoryFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  // Define the main categories to show (All Books + 5 main categories)
  const mainCategories = ["all", "history", "politics", "economics", "philosophy", "religion"]

  const toggleCategory = (categoryId: string) => {
    if (categoryId === "all") {
      // If "All" is selected, only select "All"
      onCategoryChange(["all"])
      return
    }

    let newSelectedCategories: string[]

    // If "All" is currently selected and we're selecting another category
    if (selectedCategories.includes("all")) {
      newSelectedCategories = [categoryId]
    } else {
      // Toggle the selected category
      if (selectedCategories.includes(categoryId)) {
        newSelectedCategories = selectedCategories.filter((id) => id !== categoryId)
        // If no categories are selected, default to "All"
        if (newSelectedCategories.length === 0) {
          newSelectedCategories = ["all"]
        }
      } else {
        newSelectedCategories = [...selectedCategories, categoryId]
      }
    }

    onCategoryChange(newSelectedCategories)
  }

  // For mobile view, show only selected categories when collapsed
  // For desktop, show main categories when collapsed
  const displayedCategories = isExpanded
    ? categories
    : categories.filter((cat) => mainCategories.includes(cat.id) || selectedCategories.includes(cat.id))

  return (
    <div className="mb-4">
      <div className="flex flex-wrap items-center gap-2">
        {displayedCategories.map((category) => (
          <button
            key={category.id}
            onClick={() => toggleCategory(category.id)}
            className={`px-3 py-1 text-sm rounded-full transition-colors ${
              selectedCategories.includes(category.id)
                ? "bg-black dark:bg-white text-white dark:text-black"
                : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            {category.name}
          </button>
        ))}

        {/* Show expand/collapse button if there are more categories than the main ones */}
        {categories.length > mainCategories.length && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            {isExpanded ? "Show Less" : "More..."}
          </button>
        )}
      </div>
    </div>
  )
}
