"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function AuthButton() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleAuth = async () => {
    if (user) {
      await signOut()
      router.push("/")
    } else {
      router.push("/auth/sign-in")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleAuth} className="border-gray-300 dark:border-gray-700">
      {user ? "Sign Out" : "Sign In"}
    </Button>
  )
}
