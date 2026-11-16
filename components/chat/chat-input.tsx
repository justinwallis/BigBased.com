"use client"

import type React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon, ChevronDownIcon } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
  onToggleSuggestions?: () => void
  suggestionsOpen?: boolean
}

export function ChatInput({ onSendMessage, isLoading, onToggleSuggestions, suggestionsOpen = true }: ChatInputProps) {
  const [currentInput, setCurrentInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim() && !isLoading) {
      onSendMessage(currentInput)
      setCurrentInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative mt-4 flex w-full items-center">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute left-2 border-none"
        onClick={onToggleSuggestions}
        aria-label={suggestionsOpen ? "Hide suggested prompts" : "Show suggested prompts"}
        aria-expanded={suggestionsOpen}
      >
        <ChevronDownIcon className={"h-4 w-4 transition-transform " + (suggestionsOpen ? "rotate-180" : "")} />
      </Button>
      <Input
        className="w-full rounded-lg border-none bg-gray-100 py-2 pl-10 pr-12 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-gray-800"
        placeholder="Type anything to BigBased..."
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" size="icon" className="absolute right-2 border-none" disabled={isLoading || !currentInput.trim()}>
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
