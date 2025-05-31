"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import Link from "next/link"

export function SignupPopup() {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if the popup has been dismissed in this session
    const dismissed = sessionStorage.getItem("signupPopupDismissed")
    if (dismissed) {
      setIsDismissed(true)
      return
    }

    // Show popup after 10 seconds
    const timeoutId = setTimeout(() => {
      setIsVisible(true)
    }, 10000)

    // Show popup on scroll
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
        window.removeEventListener("scroll", handleScroll)
      }
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleDismiss = () => {
    setIsVisible(false)
    setIsDismissed(true)
    sessionStorage.setItem("signupPopupDismissed", "true")
  }

  if (isDismissed || !isVisible) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm w-full animate-fade-in">
      <Card className="shadow-lg border-2 border-gray-200 dark:border-gray-800">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Join Big Based</CardTitle>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Connect with friends and join our community of like-minded individuals.
          </p>
          <div className="flex flex-col space-y-2">
            <Link href="/auth/sign-up" className="w-full">
              <Button className="w-full">Sign Up</Button>
            </Link>
            <Link href="/auth/sign-in" className="w-full">
              <Button variant="outline" className="w-full">
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="pt-0 text-xs text-gray-500 dark:text-gray-400">
          By joining, you agree to our Terms of Service and Privacy Policy.
        </CardFooter>
      </Card>
    </div>
  )
}

export default SignupPopup
