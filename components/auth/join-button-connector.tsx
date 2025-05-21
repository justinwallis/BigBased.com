"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"

export default function JoinButtonConnector() {
  const { user } = useAuth()
  const router = useRouter()

  if (user) {
    return null
  }

  return (
    <Button onClick={() => router.push("/auth/sign-up")} className="bg-red-600 hover:bg-red-700 text-white">
      Join
    </Button>
  )
}
