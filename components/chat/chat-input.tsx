"use client"

import type React from "react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SendIcon, ChevronDownIcon } from "lucide-react"
import { useState } from "react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [currentInput, setCurrentInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (currentInput.trim() && !isLoading) {
      onSendMessage(currentInput)
      setCurrentInput("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex items-center w-full mt-4">
      <Button variant="ghost" size="icon" className="absolute left-2 border-none">
        <ChevronDownIcon className="h-4 w-4" />
      </Button>
      <Input
        className="bb-2025-field w-full py-2 pl-10 pr-12 text-sm"
        placeholder="Type anything to BigBased..."
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        disabled={isLoading}
      />
      <Button type="submit" size="icon" className="bb-2025-action absolute right-2 border-none" disabled={isLoading}>
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  )
}
