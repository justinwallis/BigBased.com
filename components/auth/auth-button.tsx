"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"

export default function AuthButton() {
  const router = useRouter()

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => router.push("/auth/sign-in")}
      className="flex items-center gap-2"
    >
      <LogIn className="h-4 w-4" />
      <span>Sign In</span>
    </Button>
  )
}
