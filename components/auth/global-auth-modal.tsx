"use client"

import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

// Dynamically import forms to avoid SSR issues
const LoginForm = dynamic(() => import("./login-form"), { ssr: false })
const SignupForm = dynamic(() => import("./signup-form"), { ssr: false })

export default function GlobalAuthModal() {
  const { showAuthModal, setShowAuthModal, currentAuthTab, setAuthTab } = useAuth()
  const [isMounted, setIsMounted] = useState(false)

  // Only render on client side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <Dialog open={showAuthModal} onOpenChange={setShowAuthModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col items-center space-y-2">
          <div className="flex justify-center w-full mb-2">
            <Image src="/bb-logo.png" alt="Big Based Logo" width={80} height={80} priority className="mx-auto" />
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
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm onSuccess={() => setShowAuthModal(false)} />
          </TabsContent>
          <TabsContent value="signup">
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
