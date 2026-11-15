"use client"

/**
 * Isolated visual-review compatibility shim.
 *
 * The original June 2025 BigBased JSX imports useChat from "ai/react" (AI SDK 4).
 * This app currently resolves AI SDK 7, which does not export that path.
 * Preserve the exact original JSX and CSS by aliasing that legacy import here.
 *
 * IMPORTANT: This intentionally does not send API requests or synthesize model
 * answers. Local-only text input is sufficient to inspect the original design.
 * Do not merge this shim into a production AI implementation.
 */

import { useCallback, useState } from "react"
import type { ChangeEvent, FormEvent } from "react"

type PreviewMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type LegacyUseChatOptions = {
  api?: string
  body?: Record<string, unknown>
  initialMessages?: PreviewMessage[]
}

// Export shape mirrors only the fields used by the two original components.
export function useChat({ initialMessages = [] }: LegacyUseChatOptions = {}) {
  const [messages, setMessages] = useState<PreviewMessage[]>(initialMessages)
  const [input, setInput] = useState("")

  const append = useCallback(async (message: Pick<PreviewMessage, "role" | "content">) => {
    if (!message.content.trim()) return null

    setMessages((existing) => [
      ...existing,
      { id: `visual-review-${crypto.randomUUID()}`, role: message.role, content: message.content },
    ])

    // No AI provider or original API calls in a visual-only review.
    return null
  }, [])

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value)
  }, [])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      if (!input.trim()) return
      void append({ role: "user", content: input })
      setInput("")
    },
    [append, input],
  )

  return { messages, input, handleInputChange, handleSubmit, isLoading: false, append }
}
