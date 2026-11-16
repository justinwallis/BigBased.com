"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"

export type LegacyChatMessage = {
  id: string
  role: "user" | "assistant"
  content: string
}

type LegacyChatThread = {
  id: string
  title: string
  messages: LegacyChatMessage[]
  updatedAt: number
}

type ChatWorkspaceValue = {
  threads: LegacyChatThread[]
  messages: LegacyChatMessage[]
  activeId: string | null
  newChat: () => void
  openChat: (id: string) => void
  removeChat: (id: string) => void
  sendMessage: (content: string) => void
  beginTopic: (title: string) => void
}

const STORAGE_KEY = "bigbased-2025-chat-visual-review-v1"
const MAX_THREADS = 40
const MAX_MESSAGES = 100
const MAX_MESSAGE_LENGTH = 4000

const WorkspaceContext = createContext<ChatWorkspaceValue | null>(null)

function createUserMessage(content: string): LegacyChatMessage {
  return { id: crypto.randomUUID(), role: "user", content }
}

export function ChatWorkspaceProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<LegacyChatThread[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    // This is a local visual review. Conversations never call the legacy AI
    // endpoint or Supabase, and are not synchronized to another browser.
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed: unknown = JSON.parse(raw)
        if (parsed && typeof parsed === "object" && "threads" in parsed) {
          const state = parsed as { threads?: unknown; activeId?: unknown }
          if (Array.isArray(state.threads)) {
            const restored: LegacyChatThread[] = state.threads
              .filter((item): item is LegacyChatThread =>
                item && typeof item.id === "string" && typeof item.title === "string" &&
                Array.isArray(item.messages) && typeof item.updatedAt === "number"
              )
              .slice(0, MAX_THREADS)
              .map((item) => ({
                ...item,
                title: item.title.slice(0, 100),
                messages: item.messages
                  .filter((message) =>
                    message && typeof message.id === "string" &&
                    (message.role === "user" || message.role === "assistant") &&
                    typeof message.content === "string"
                  )
                  .slice(0, MAX_MESSAGES)
                  .map((message) => ({ ...message, content: message.content.slice(0, MAX_MESSAGE_LENGTH) })),
              }))
            setThreads(restored)
            if (typeof state.activeId === "string" && restored.some((item) => item.id === state.activeId)) {
              setActiveId(state.activeId)
            }
          }
        }
      }
    } catch {
      // A blocked or malformed sessionStorage entry must never prevent the
      // original visual design from rendering.
    } finally {
      setHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ threads, activeId }))
    } catch {
      // Session storage is best-effort: the UI remains usable in memory.
    }
  }, [threads, activeId, hydrated])

  const newChat = useCallback(() => setActiveId(null), [])

  const openChat = useCallback((id: string) => {
    setActiveId((current) => id || current)
  }, [])

  const removeChat = useCallback((id: string) => {
    setThreads((current) => current.filter((thread) => thread.id !== id))
    setActiveId((current) => (current === id ? null : current))
  }, [])

  const sendMessage = useCallback((raw: string) => {
    const content = raw.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!content) return
    const id = activeId ?? crypto.randomUUID()
    const message = createUserMessage(content)

    setThreads((current) => {
      const existing = current.find((thread) => thread.id === id)
      if (existing) {
        return current.map((thread) => thread.id === id
          ? { ...thread, messages: [...thread.messages, message].slice(-MAX_MESSAGES), updatedAt: Date.now() }
          : thread)
      }
      return [{
        id,
        title: content.slice(0, 58),
        messages: [message],
        updatedAt: Date.now(),
      }, ...current].slice(0, MAX_THREADS)
    })
    setActiveId(id)
  }, [activeId])

  const beginTopic = useCallback((title: string) => {
    const id = crypto.randomUUID()
    const prompt = title.trim().slice(0, MAX_MESSAGE_LENGTH)
    if (!prompt) return
    setThreads((current) => [{
      id,
      title: prompt.slice(0, 58),
      messages: [createUserMessage(prompt)],
      updatedAt: Date.now(),
    }, ...current].slice(0, MAX_THREADS))
    setActiveId(id)
  }, [])

  const activeThread = threads.find((thread) => thread.id === activeId)
  const value = useMemo<ChatWorkspaceValue>(() => ({
    threads, messages: activeThread?.messages ?? [], activeId,
    newChat, openChat, removeChat, sendMessage, beginTopic,
  }), [threads, activeThread, activeId, newChat, openChat, removeChat, sendMessage, beginTopic])

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>
}

export function useChatWorkspace(): ChatWorkspaceValue {
  const workspace = useContext(WorkspaceContext)
  if (!workspace) {
    throw new Error("The original chat workspace must be rendered inside ChatWorkspaceProvider")
  }
  return workspace
}
