"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function JoinButtonConnector() {
  const router = useRouter()

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

            // Redirect to sign-up page
            router.push("/auth/sign-up")

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
  }, [router])

  // This component doesn't render anything
  return null
}
