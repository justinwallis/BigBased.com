"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function JoinButtonConnector() {
  const router = useRouter()
  const [authContext, setAuthContext] = useState<{
    setShowAuthModal: ((show: boolean) => void) | undefined
    setAuthTab: ((tab: "login" | "signup") => void) | undefined
  }>({ setShowAuthModal: undefined, setAuthTab: undefined })

  useEffect(() => {
    try {
      const context = useAuth()
      setAuthContext({ setShowAuthModal: context.setShowAuthModal, setAuthTab: context.setAuthTab })
    } catch (error) {
      console.warn("Auth context not available, join buttons will redirect to signup page")
    }
  }, [])

  useEffect(() => {
    try {
      // Function to find and modify join buttons
      const findAndModifyJoinButtons = () => {
        // Find all buttons or links with text content containing "Join"
        const joinButtons = Array.from(document.querySelectorAll("button, a")).filter(
          (el) => el.textContent?.trim().toLowerCase() === "join",
        )

        // Modify each join button
        joinButtons.forEach((button) => {
          // Store original click handler
          const originalOnClick = button.onclick

          // Replace with our handler
          button.onclick = (e) => {
            e.preventDefault()
            e.stopPropagation()

            if (authContext.setShowAuthModal && authContext.setAuthTab) {
              // Open auth modal with signup tab if auth context is available
              authContext.setAuthTab("signup")
              authContext.setShowAuthModal(true)
            } else {
              // Fallback to redirect if auth context is not available
              router.push("/auth/signup")
            }

            // Optionally call original handler
            if (typeof originalOnClick === "function") {
              originalOnClick.call(button, e)
            }

            return false
          }

          // Add a data attribute to mark as processed
          button.setAttribute("data-auth-connected", "true")
        })
      }

      // Run initially
      setTimeout(findAndModifyJoinButtons, 1000)

      // Set up a MutationObserver to watch for DOM changes
      const observer = new MutationObserver((mutations) => {
        // Check if any mutations added new nodes
        const hasNewNodes = mutations.some(
          (mutation) => mutation.type === "childList" && mutation.addedNodes.length > 0,
        )

        if (hasNewNodes) {
          // If new nodes were added, check for join buttons again
          findAndModifyJoinButtons()
        }
      })

      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true })

      // Cleanup
      return () => {
        observer.disconnect()
      }
    } catch (error) {
      console.error("Error in JoinButtonConnector:", error)
    }
  }, [authContext.setShowAuthModal, authContext.setAuthTab, router])

  // This component doesn't render anything
  return null
}
