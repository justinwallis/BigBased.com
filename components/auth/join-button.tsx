"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function JoinButton() {
  const router = useRouter()
  const [buttonText, setButtonText] = useState("Join")
  const [isAlternating, setIsAlternating] = useState(true)

  useEffect(() => {
    // Check if user has previously logged in
    const hasLoggedIn = localStorage.getItem("hasLoggedIn") === "true"
    if (hasLoggedIn) {
      setButtonText("Login")
      setIsAlternating(false) // Don't alternate if we know they've logged in
    }

    // Only set up animation if we're alternating
    let interval: NodeJS.Timeout | null = null

    if (isAlternating) {
      interval = setInterval(() => {
        setButtonText((prev) => (prev === "Join" ? "Login" : "Join"))
      }, 3000) // Change every 3 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAlternating])

  const handleClick = () => {
    if (buttonText === "Login") {
      router.push("/auth/sign-in")
    } else {
      router.push("/auth/sign-up")
    }
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      className="bg-primary hover:bg-primary/90 text-white transition-all duration-300"
    >
      {buttonText}
    </Button>
  )
}
