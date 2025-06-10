"use client"

import { Button } from "@/components/ui/button"
import { BrainIcon, LightbulbIcon, SearchIcon, TrendingUpIcon } from "lucide-react"

interface ChatSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void
}

export function ChatSuggestions({ onSelectSuggestion }: ChatSuggestionsProps) {
  const suggestions = [
    { text: "Trending Topics", icon: TrendingUpIcon },
    { text: "Core Principles", icon: LightbulbIcon },
    { text: "Community Guidelines", icon: BrainIcon },
    { text: "Knowledge Base", icon: SearchIcon },
  ]

  return (
    <div className="grid grid-cols-2 gap-4 p-4 md:grid-cols-4">
      {suggestions.map((suggestion, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex flex-col items-center justify-center h-24 text-center"
          onClick={() => onSelectSuggestion(suggestion.text)}
        >
          <suggestion.icon className="h-6 w-6 mb-2" />
          {suggestion.text}
        </Button>
      ))}
    </div>
  )
}
