"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

export default function SignupPopup() {
  const [showPopup, setShowPopup] = useState(false)
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Show popup after 5 seconds if user is not logged in
    if (!user) {
      const timer = setTimeout(() => {
        setShowPopup(true)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [user])

  return (
    <Dialog open={showPopup} onOpenChange={setShowPopup}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Join to connect with friends</DialogTitle>
          <DialogDescription>Sign up to see photos and updates from friends in Big Based.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input id="email" defaultValue="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="password" className="text-right">
              Password
            </Label>
            <Input id="password" type="password" className="col-span-3" />
          </div>
        </div>
        <Button>Sign Up</Button>
      </DialogContent>
    </Dialog>
  )
}
