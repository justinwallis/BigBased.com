"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TabsList, TabsTrigger } from "@/components/ui/tabs"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"
import Image from "next/image"
import "../app/auth-animations.css"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  defaultTab?: "login" | "signup"
}

export default function AuthModal({ isOpen, onClose, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [previousTab, setPreviousTab] = useState<string>(defaultTab)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Handle tab changes with animation
  const handleTabChange = (value: string) => {
    if (value !== activeTab && !isTransitioning) {
      setIsTransitioning(true)
      setPreviousTab(activeTab)
      setActiveTab(value)

      // Reset transition state after animation completes
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300) // Match this to your CSS transition duration
    }
  }

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setActiveTab(defaultTab)
        setPreviousTab(defaultTab)
        setIsTransitioning(false)
      }, 300)
    }
  }, [isOpen, defaultTab])

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] shadow-2xl border-0 overflow-hidden">
        <div className="flex justify-center mb-2">
          <Image src="/bb-logo.png" alt="Big Based Logo" width={80} height={80} priority />
        </div>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            {activeTab === "login" ? "Welcome Back" : "Join BigBased"}
          </DialogTitle>
        </DialogHeader>

        <div className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="login"
              onClick={() => handleTabChange("login")}
              data-state={activeTab === "login" ? "active" : "inactive"}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              onClick={() => handleTabChange("signup")}
              data-state={activeTab === "signup" ? "active" : "inactive"}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <div className="auth-tabs-container">
            <div
              className={activeTab === "login" ? "auth-tab-content-active" : "auth-tab-content-inactive"}
              aria-hidden={activeTab !== "login"}
            >
              <LoginForm onSuccess={onClose} />
            </div>

            <div
              className={activeTab === "signup" ? "auth-tab-content-active" : "auth-tab-content-inactive"}
              aria-hidden={activeTab !== "signup"}
            >
              <SignupForm onSuccess={onClose} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
