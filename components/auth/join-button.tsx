"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function JoinButton() {
  const router = useRouter()
  const [hasAccount, setHasAccount] = useState(false)
  const [currentText, setCurrentText] = useState("Join")
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    // Check if user has previously logged in
    const hasLoggedIn = localStorage.getItem("hasLoggedIn") === "true"
    setHasAccount(hasLoggedIn)
    setCurrentText(hasLoggedIn ? "Login" : "Join")

    // Set up animation interval
    const interval = setInterval(() => {
      setIsAnimating(true)
      setTimeout(() => {
        setCurrentText((prev) => (prev === "Join" ? "Login" : "Join"))
        setIsAnimating(false)
      }, 500) // Half of the interval for fade out
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [])

  const handleClick = () => {
    if (hasAccount) {
      router.push("/auth/sign-in")
    } else {
      router.push("/auth/sign-up")
    }
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      className="bg-primary hover:bg-primary/90 text-white relative overflow-hidden"
    >
      <span
        className={`transition-opacity duration-500 absolute inset-0 flex items-center justify-center w-full ${
          isAnimating ? "opacity-0" : "opacity-100"
        }`}
      >
        {currentText}
      </span>
      <span className="opacity-0">
        {currentText} {/* Placeholder to maintain button width */}
      </span>
    </Button>
  )
}
