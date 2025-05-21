"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function JoinButtonConnector() {
  const router = useRouter()

  useEffect(() => {
    // Function to find and modify join buttons
    const findAndModifyJoinButtons = () => {
      // Find all buttons or links with text content containing "Join"
      const joinButtons = Array.from(document.querySelectorAll("button, a")).filter((el) => {
        const text = el.textContent?.trim().toLowerCase() || ""
        return text === "join" || text === "join now" || text.includes("join")
      })

      // Modify each join button
      joinButtons.forEach((button) => {
        // Skip if already processed
        if (button.getAttribute("data-auth-connected") === "true") return

        // Add click event listener
        button.addEventListener("click", (e) => {
          e.preventDefault()
          e.stopPropagation()
          console.log("Join button clicked, redirecting to /auth/sign-up")
          router.push("/auth/sign-up")
          return false
        })

        // Add a data attribute to mark as processed
        button.setAttribute("data-auth-connected", "true")
        console.log("Join button connected:", button)
      })
    }

    // Run initially and then periodically
    findAndModifyJoinButtons()
    const interval = setInterval(findAndModifyJoinButtons, 2000)

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      // Check if any mutations added new nodes
      const hasNewNodes = mutations.some((mutation) => mutation.type === "childList" && mutation.addedNodes.length > 0)

      if (hasNewNodes) {
        // If new nodes were added, check for join buttons again
        findAndModifyJoinButtons()
      }
    })

    // Start observing the document with the configured parameters
    observer.observe(document.body, { childList: true, subtree: true })

    // Cleanup
    return () => {
      clearInterval(interval)
      observer.disconnect()
    }
  }, [router])

  // This component doesn't render anything
  return null
}
