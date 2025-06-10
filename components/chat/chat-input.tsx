"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { SendIcon, ChevronDownIcon } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
  isLoading: boolean
}

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState("")
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
  }

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message.trim())
      setMessage("")
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto" // Reset height
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto"
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px"
    }
  }, [message])

  return (
    <div className="relative flex items-center p-4 border-t border-gray-200 dark:border-gray-800">
      <Button variant="ghost" size="icon" className="absolute left-6 top-1/2 -translate-y-1/2">
        <ChevronDownIcon className="h-4 w-4" />
        <span className="sr-only">Options</span>
      </Button>
      <Textarea
        ref={textareaRef}
        placeholder="Type anything to BigBased..."
        value={message}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        rows={1}
        maxRows={6}
        className="min-h-[48px] resize-none overflow-hidden rounded-2xl border border-gray-300 bg-white pl-14 pr-16 shadow-sm focus:border-primary focus:ring-primary dark:border-gray-700 dark:bg-gray-950 dark:text-white"
        disabled={isLoading}
      />
      <Button
        type="submit"
        size="icon"
        className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full"
        onClick={handleSendMessage}
        disabled={!message.trim() || isLoading}
      >
        <SendIcon className="h-4 w-4" />
        <span className="sr-only">Send message</span>
      </Button>
    </div>
  )
}
