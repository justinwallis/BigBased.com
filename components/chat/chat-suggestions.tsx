"use client"

import { Button } from "@/components/ui/button"
import { BrainIcon, TrendingUpIcon, LinkIcon, BarChartIcon } from "lucide-react"

interface ChatSuggestionsProps {
  onSelectSuggestion: (suggestion: string) => void
}

export function ChatSuggestions({ onSelectSuggestion }: ChatSuggestionsProps) {
  const suggestions = [
    { icon: TrendingUpIcon, text: "Trending", prompt: "What's trending in Big Based information?" },
    { icon: LinkIcon, text: "Knowledge", prompt: "Tell me about the core knowledge base of Big Based." },
    { icon: BarChartIcon, text: "Analytics", prompt: "How can I view analytics for my Big Based content?" },
    { icon: BrainIcon, text: "AI Features", prompt: "What AI features are available in Big Based?" },
  ]

  return (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {suggestions.map((s, index) => (
        <Button
          key={index}
          variant="outline"
          className="flex items-center gap-2 border-none bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-50 hover:bg-gray-200 dark:hover:bg-gray-700"
          onClick={() => onSelectSuggestion(s.prompt)}
        >
          <s.icon className="h-4 w-4" />
          {s.text}
        </Button>
      ))}
    </div>
  )
}
