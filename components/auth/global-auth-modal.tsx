"use client"

import { useAuth } from "@/contexts/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

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
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
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
