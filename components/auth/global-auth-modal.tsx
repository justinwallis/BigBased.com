"use client"

import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState, useRef } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { useTheme } from "next-themes"
import { X } from "lucide-react"

// Dynamically import forms to avoid SSR issues
const LoginForm = dynamic(() => import("./login-form"), { ssr: false })
const SignupForm = dynamic(() => import("./signup-form"), { ssr: false })

export default function GlobalAuthModal() {
  const { showAuthModal, setShowAuthModal, currentAuthTab, setAuthTab } = useAuth()
  const [isMounted, setIsMounted] = useState(false)
  const { theme } = useTheme()
  const dialogContentRef = useRef<HTMLDivElement>(null)

  // Only render on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (showAuthModal) {
      // Save current scroll position
      const scrollY = window.scrollY

      // Add styles to prevent body scroll
      document.body.style.position = "fixed"
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = "100%"

      return () => {
        // Restore scroll position when modal closes
        document.body.style.position = ""
        document.body.style.top = ""
        document.body.style.width = ""
        window.scrollTo(0, scrollY)
      }
    }
  }, [showAuthModal])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent
        ref={dialogContentRef}
        className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto"
        onScroll={(e) => {
          // Prevent event propagation to avoid scrolling the body
          e.stopPropagation()
        }}
      >
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-20 dark:text-white">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader className="flex flex-col items-center space-y-2 sticky top-0 bg-background z-10 pt-6 pb-2">
          <div className="flex justify-center w-full mb-2">
            <Image
              src="/BigBasedIconInvert.png"
              alt="Big Based Logo"
              width={80}
              height={80}
              priority
              className="mx-auto hidden dark:block"
            />
            <Image
              src="/bb-logo.png"
              alt="Big Based Logo"
              width={80}
              height={80}
              priority
              className="mx-auto dark:hidden"
            />
          </div>
          <DialogTitle className="text-center text-2xl font-bold dark:text-white">
            {currentAuthTab === "login" ? "Welcome Back" : "Join BigBased"}
          </DialogTitle>
        </DialogHeader>
        <Tabs
          defaultValue={currentAuthTab}
          value={currentAuthTab}
          onValueChange={(value) => setAuthTab(value as "login" | "signup")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 sticky top-[132px] z-10 bg-background">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login" className="pb-6">
            <LoginForm onSuccess={() => setShowAuthModal(false)} />
          </TabsContent>
          <TabsContent value="signup" className="pb-6">
            <SignupForm
              onSuccess={() => {
                setAuthTab("login")
              }}
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
