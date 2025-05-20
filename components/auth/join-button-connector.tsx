"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const JoinButtonConnector = () => {
  const router = useRouter()
  const { setShowAuthModal, setAuthTab } = useAuth()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    try {
      // Function to find and modify join buttons
      const findAndModifyJoinButtons = () => {
        console.log("Looking for join buttons...")
        // Find all buttons or links with text content containing "Join"
        const joinButtons = Array.from(document.querySelectorAll("button, a")).filter((el) => {
          const text = el.textContent?.trim().toLowerCase()
          return text === "join" || text === "join now" || text === "sign up" || text === "signup"
        })

        console.log(`Found ${joinButtons.length} join buttons`)

        // Modify each join button
        joinButtons.forEach((button) => {
          // Skip if already processed
          if (button.getAttribute("data-auth-connected") === "true") {
            return
          }

          console.log("Connecting join button:", button)

          // Store original click handler
          const originalOnClick = button.onclick

          // Replace with our handler
          button.onclick = (e) => {
            e.preventDefault()
            e.stopPropagation()
            console.log("Join button clicked, opening auth modal")

            // Open auth modal with signup tab
            setAuthTab("signup")
            setShowAuthModal(true)

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

      // Run initially after a short delay to ensure DOM is loaded
      const initialTimer = setTimeout(() => {
        findAndModifyJoinButtons()
        setIsInitialized(true)
      }, 1000)

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

      // Also run periodically to catch any buttons that might have been missed
      const intervalTimer = setInterval(findAndModifyJoinButtons, 3000)

      // Cleanup
      return () => {
        clearTimeout(initialTimer)
        clearInterval(intervalTimer)
        observer.disconnect()
      }
    } catch (error) {
      console.error("Error in JoinButtonConnector:", error)
    }
  }, [setShowAuthModal, setAuthTab])

  // This component doesn't render anything
  return null
}

export default JoinButtonConnector
